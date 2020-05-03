// @flow
import hive from 'hivejs';
import * as ProcessingActions from './processing';

export const HIVE_GLOBALPROPS_UPDATE = 'HIVE_GLOBALPROPS_UPDATE';
export const HIVE_GLOBALPROPS_UPDATE_RESOLVED = 'HIVE_GLOBALPROPS_UPDATE_RESOLVED';

export function refreshGlobalProps() {
  return (dispatch: () => void) => {
    hive.api.getDynamicGlobalProperties((err, results) => {
      if (err) {
        // dispatch({
        //   type: ACCOUNT_DATA_UPDATE_FAILED,
        //   payload: err
        // });
      } else {
        if(results.virtual_supply.search('HIVE') !== -1){
          results.network = "Hive";
        } else if(results.virtual_supply.search('STEEM') !== -1){
          results.network = "Steem";
        } else {
          results.network = "Unknown";
        }

        dispatch({
          type: HIVE_GLOBALPROPS_UPDATE_RESOLVED,
          payload: results
        });
      }
    });
  };
}
