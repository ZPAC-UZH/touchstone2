import React from 'react';
import {TitleTexts} from '../constants/index';

export const insertText = (type) => {
  switch (type) {
    case TitleTexts.HELPTEXT.design:
      return (
        <>
          <p>You can add one block into the design. Please find a
            descriptive
            name for it.</p>
          <p><b>Participants:</b> the number of participants for whom a trial
            table will be generated.</p>
          <p><b>Average duration per trial:</b> the time how long
            a participant needs to advance from one trial to the next.</p>
          <p><b>Delay after each trial:</b> the pause between two consecutive
            trials.</p>
          <p><b>Delay after each block:</b> the pause between consecutive
            experimental design blocks. Possible
            breaks should be added in here.</p>
        </>
      );
    case TitleTexts.HELPTEXT.block:
      return (
        <>
          <p>You can add independent variables into the first slot, and nest
            another block in the second slot.</p>
          <p><b>Replications:</b> A group of rows is replicated and assigned
            to the same participant in order to decrease the variance / mean
            error with more data points. Changing the number of replications
            could have an effect on the counterbalancing strategy.
          </p>
          <p><b>Serial:</b> With the serial option, all replicated trials follow
            each other.</p>
          <p><b>Counterbalancing:</b></p>
          <ul>
            <li><i>Fixed Order:</i> each participant is exposed to a
              predefined order of levels.
            </li>
            <li><i>Latin square:</i> the order of levels are
              counterbalanced across a subset of participants using a Latin
              Square.
            </li>
            <li><i>Random:</i> Each participant is exposed to a randomised
              order of levels.
            </li>
            <li><i>Complete:</i> The order of levels are completely permuted
              across a subset of participants.
            </li>
          </ul>
        </>);
    case TitleTexts.HELPTEXT.independentVariable:
      return (
        <>
          <p>An independent variable needs to have at least two levels.</p>
          <p>The number of independent variables (IVs) has different dis-/
            advantages. Try to reduce the number of IVs, to just test your
            hypothesis. If your experiment is too complex, try to break down
            your hypothesis into two experiments.</p>
          <p><b>Advantage</b>: the more IVs you want to control, the more data
            you will have to
            analyse.</p>
          <p><b>Disadvantage</b>: the more IVs you want to control, the harder
            the data analysis
            will be and the longer will the experiment be.</p>
        </>
      );
    case TitleTexts.HELPTEXT.level:
      return (
        <>
          <p>Increasing the number of levels has different dis-/
            advantages.</p>
          <p><b>Advantages</b>: The more levels an independent variable has
            the more data you have to analyse.</p>
          <p><b>Disadvantages</b>: Increasing the number of levels will make
            it more difficult to control their effect. The data analysis gets
            more difficult </p>
          <p>Try to keep the number of levels as low as possible.</p>
        </>
      );
    default:
      return (
        <>
          <p>A design holds one or multiple blocks. Please find a descriptive
            name for it.</p>
          <p><b>Participants:</b> the number of participants for whom a trial
            table will be generated.</p>
          <p><b>Inter trial time:</b> the inter trial time specifies the time
            a participant needs to advance from one trial to the next.</p>
          <p><b>Inter block time:</b> the inter block time specifies the time
            a participant needs to advance form one block to the next. Possible
            breaks should be added in here.</p>
        </>
      );
  }
};
