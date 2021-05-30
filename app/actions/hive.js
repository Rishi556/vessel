// @flow
import hive from '@hiveio/hive-js';
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
        if(results.virtual_supply.search('HIVE') >= 0){
          results.network = "Hive";
        } else if(results.virtual_supply.search('TESTS') >= 0){
          results.network = "Hive Testnet";
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
