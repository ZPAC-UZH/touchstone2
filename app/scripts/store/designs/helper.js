import Blockly from 'node-blockly/browser';
import {generateTslWithMeta as tslParser} from 'touchstone-language';


const getOrCreateData = (design, storedDesigns) => {
  let existed = false;
  if (storedDesigns.designData) {
    if (storedDesigns.designData.length) {
      storedDesigns.designData.forEach(item => {
        if (item.tsl === design.tsl && design.numberOfParticipants === item.numberOfParticipants && design.xml === item.xml) {
          design.trialTable = item.trialTable;
          design.multiple = item.multiple;
          design.variables = item.variables;
          design.xml = item.xml;
          existed = true;
        }
      });
    }
  }

  if (!existed) {
    const trialTableWithMeta = tslParser(design.tsl, design.numberOfParticipants) || [];
    design.trialTable = trialTableWithMeta.trialTable;
    design.multiple = trialTableWithMeta.multiplePCount;
    design.variables = trialTableWithMeta.variables;
    const brick = Blockly.mainWorkspace.getBlockById(design.designId);
    design.xml = Blockly.Xml.domToPrettyText(Blockly.Xml.blockToDom(brick)); // the XML is needed for the download
  }
  return {
    design,
    existed,
  };
};

export {getOrCreateData};
