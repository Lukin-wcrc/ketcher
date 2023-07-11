/****************************************************************************
 * Copyright 2021 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import { IRnaPreset } from 'components/monomerLibrary/RnaBuilder/types'
import { RootState } from 'state'
import { MonomerGroups } from '../../constants'
import { MonomerItemType } from 'components/monomerLibrary/monomerLibraryItem/types'

export enum RnaBuilderPresetsItem {
  Presets = 'Presets'
}

export type RnaBuilderItem = RnaBuilderPresetsItem | MonomerGroups

interface IRnaBuilderState {
  activePreset: IRnaPreset | null
  presets: IRnaPreset[]
  activeRnaBuilderItem?: RnaBuilderItem | null
  isEditMode: boolean
}

const initialState: IRnaBuilderState = {
  activePreset: null,
  presets: [],
  activeRnaBuilderItem: null,
  isEditMode: false
}

export const monomerGroupToPresetGroup = {
  [MonomerGroups.BASES]: 'base',
  [MonomerGroups.SUGARS]: 'sugar',
  [MonomerGroups.PHOSPHATES]: 'phosphate'
}

export const rnaBuilderSlice = createSlice({
  name: 'rna-builder',
  initialState,
  reducers: {
    createNewPreset: (state) => {
      state.activePreset = {
        base: undefined,
        sugar: undefined,
        phosphate: undefined,
        name: ''
      }
    },
    setActivePreset: (state, action: PayloadAction<IRnaPreset>) => {
      state.activePreset = {
        ...action.payload,
        presetInList: action.payload
      }
    },
    setActivePresetName: (state, action: PayloadAction<string>) => {
      state.activePreset!.name = action.payload
    },
    setActiveRnaBuilderItem: (state, action: PayloadAction<RnaBuilderItem>) => {
      state.activeRnaBuilderItem = action.payload
    },
    setActivePresetMonomerGroup: (
      state,
      action: PayloadAction<{
        groupName: MonomerGroups
        groupItem: MonomerItemType
      }>
    ) => {
      state.activePreset![monomerGroupToPresetGroup[action.payload.groupName]] =
        action.payload.groupItem
    },
    savePreset: (state, action: PayloadAction<IRnaPreset>) => {
      const preset = action.payload
      const newPreset = { ...preset }

      if (preset.presetInList) {
        const presetIndexInList = state.presets.indexOf(preset.presetInList)
        state.presets.splice(presetIndexInList, 1, newPreset)
      } else {
        state.presets.push(newPreset)
      }
      state.activePreset!.presetInList = newPreset
    },
    setIsEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload
    }
  }
})

export const selectActiveRnaBuilderItem = (state: RootState): RnaBuilderItem =>
  state.rnaBuilder.activeRnaBuilderItem

export const selectActivePreset = (state: RootState): IRnaPreset =>
  state.rnaBuilder.activePreset

export const selectPresets = (state: RootState): IRnaPreset[] => {
  return state.rnaBuilder.presets
}

export const selectActivePresetMonomerGroup = (
  preset: IRnaPreset,
  groupName: MonomerGroups | string
) => {
  if (!monomerGroupToPresetGroup[groupName] || !preset) return

  return preset[monomerGroupToPresetGroup[groupName]]
}

export const selectIsPresetReadyToSave = (preset: IRnaPreset): boolean => {
  return Boolean(
    (preset.phosphate || preset.sugar || preset.base) && preset.name
  )
}

export const selectIsEditMode = (state: RootState): boolean => {
  return state.rnaBuilder.isEditMode
}
export const selectPresetFullName = (preset: IRnaPreset): string => {
  if (!preset) return ''

  return `${preset.sugar?.props.MonomerName || ''}(${
    preset.base?.props.MonomerName || ''
  })${preset.phosphate?.props.MonomerName || ''}`
}

export const {
  setActivePreset,
  setActivePresetName,
  setActiveRnaBuilderItem,
  setActivePresetMonomerGroup,
  savePreset,
  createNewPreset,
  setIsEditMode
} = rnaBuilderSlice.actions

export const rnaBuilderReducer = rnaBuilderSlice.reducer
