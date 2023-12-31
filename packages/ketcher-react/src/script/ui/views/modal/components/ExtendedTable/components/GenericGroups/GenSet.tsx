/****************************************************************************
 * Copyright 2023 EPAM Systems
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

import type { GenItemSet } from 'ketcher-core';
import classes from './GenSet.module.less';
import { isGenericGroup } from '../../helpers';
import ButtonGenSet from './components/ButtonGenSet';

type GenSetProps = {
  labels: GenItemSet[];
  selected: (label: string) => boolean;
  onAtomSelect: (label: string, activateImmediately: boolean) => void;
  className?: string;
  group: string;
  disabledQueryElements: Array<string> | null;
};

const getGroupClassName = (groupName: string) => groupName.replaceAll(' ', '');

function GenSet({
  labels,
  selected,
  onAtomSelect,
  className,
  group,
  disabledQueryElements,
}: GenSetProps) {
  return (
    <>
      {labels.map((item, index) => {
        const buttons = item.items;
        const caption = item.displayName;
        return (
          <fieldset className={className} key={index}>
            <div className={classes[getGroupClassName(group)]}>
              {buttons.map((button, index) => (
                <ButtonGenSet
                  key={index}
                  button={button}
                  onAtomSelect={onAtomSelect}
                  selected={selected}
                  disabled={Boolean(
                    disabledQueryElements?.includes(button.label),
                  )}
                />
              ))}
            </div>
            {!isGenericGroup(group) && caption && (
              <div className={classes.legendBox}>
                <legend>{caption}</legend>
              </div>
            )}
            {isGenericGroup(group) && caption && (
              <div className={classes.genGroupLegendBox}>
                <legend className={classes.genGroupLegend}>{caption}</legend>
              </div>
            )}
          </fieldset>
        );
      })}
    </>
  );
}

export { GenSet };
