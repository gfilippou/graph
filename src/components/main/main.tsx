import { FormEvent, useContext } from 'react';
import { eventSourceSpecs } from 'src/config';
import styles from 'src/components/main/main.module.css';
import addressShortener from 'src/utilities/addressShortener';
import { actions, AppState } from 'src/app/Store';
import Loader from 'src/utilities/loader/loader';
import { Chart } from 'src/components/chart/chart';
import { convertPositionsMapToGraphData } from 'src/eventSource/eventSourceDataTransformations';

export function Main() {
  const { state, dispatch } = useContext<ContextProvider>(AppState);
  const { positionsList, totalPositionsExpected, graphAggregateData } = state;

  const loader = () => {
    if (totalPositionsExpected === 0) {
      return Loader('Loading positions');
    }
    if (positionsList.length !== totalPositionsExpected) {
      if (positionsList.length === 0)
        return Loader(`Loading ${totalPositionsExpected} positions`);
      return Loader(
        `Loaded ${positionsList.length} of ${totalPositionsExpected} positions`
      );
    }
    if (positionsList.length === totalPositionsExpected) {
      return <div className={styles.status_text}>Loading completed</div>;
    }
  };

  const graphData: GraphData =
    convertPositionsMapToGraphData(graphAggregateData);

  return (
    <div className={styles.main_container}>
      <div className={styles.columnA}>
        <div className={styles.title_1}>Options</div>
        <div className={styles.user_selections}>
          <div>Select account</div>
          <select
            className={styles.select}
            onChange={(e: FormEvent<HTMLSelectElement>) =>
              dispatch({
                type: actions.SET_SELECTED_MOA,
                payload: e.currentTarget.value,
              })
            }
          >
            {Object.values(eventSourceSpecs.availableEOAs).map((EOA) => {
              return (
                <option key={EOA} value={EOA}>
                  {addressShortener(EOA, 10)}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.title_2}>Account Positions List</div>
        <div className={styles.positions_list}>
          <ol>
            {positionsList.map((position, index) => {
              return <li key={index}>{position}</li>;
            })}
            {loader()}
          </ol>
        </div>
      </div>
      <div className={styles.columnB}>
        <div className={styles.title_3}>
          Account Positions Aggregate History Chart
        </div>
        <Chart data={graphData} />
      </div>
    </div>
  );
}
