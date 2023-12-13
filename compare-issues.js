const fs = require("fs");

// Function to find differences in occurrences between two datasets
function findDifferences(data1, data2) {
  console.log(data1.length);
  console.log(data2.length);
  const differences = {};

  // Count occurrences of techniques in the first dataset
  const occurrences1 = {};
  data1.forEach(item => {
    console.log(item.code)
    const unhandledCode = item.code;
    let code = "";
    if (unhandledCode.includes("::")) {
        code = unhandledCode
    } else if (unhandledCode.includes("Principle")) {
        const codes = handleCodeSnifferCode(unhandledCode);
        code = codes.join("_");
    } else {
        return
    }
    occurrences1[code] = occurrences1[code] ? occurrences1[code] + 1 : 1;
  });

  // Count occurrences of techniques in the second dataset
  const occurrences2 = {};
  data2.forEach(item => {
    console.log(item.code)
    const unhandledCode = item.code;
    let code = "";
    if (unhandledCode.includes("::")) {
        code = unhandledCode
    } else if (unhandledCode.includes("Principle")) {
        const codes = handleCodeSnifferCode(unhandledCode);
        code = codes.join("_");
    } else {
        return
    }
    occurrences2[code] = occurrences2[code] ? occurrences2[code] + 1 : 1;
  });
  console.log(occurrences1)
  console.log(occurrences2)

  // Find differences between the datasets
  const techniques = [...new Set([
      ...Object.keys(occurrences1),
      ...Object.keys(occurrences2)
    ])];
  techniques.forEach(technique => {
    // const [techniqueId, runnerType] = technique.split("-");
    const count1 = occurrences1[technique] || 0;
    const count2 = occurrences2[technique] || 0;
    const difference = count1 - count2;

    if (difference !== 0) {
      differences[technique] = difference;
    }
  });

  return differences;
}

const sanitizeCodeParts = code => {
  // recursively remove any value that does not match to a correct fid value
  const regexPattern = /(\.|,)[A-Z]+\d+$/;
  if (regexPattern.test(code)) {
    return code;
  } else {
    if (code.length > 0) {
      return sanitizeCodeParts(code.slice(0, -1));
    } else {
      return "";
    }
  }
};

const handleCodeSnifferCode = (code) => {
    // there are two types of codes that can appear
    // from OG scanner GUIDELINE::TECHNIQUE e.g. "2.2.2::F7";
    // Code sniffer "WCAG2AAA.Principle1.Guideline1_3.1_3_6.ARIA11,F7.Fail" -- WCAG level, principle, guideline, single or multiple guidelines, possible addendum strings at the end that are not techniques
  const sanitizedCodeParts = sanitizeCodeParts(code);
  const techniqueIds = [...sanitizedCodeParts.split(".")[sanitizedCodeParts.split(".").length - 1].split(",")];
  return techniqueIds;
};

// Read the JSON data from the files
const rawData1 = fs.readFileSync("issues-original.json");
const data1 = JSON.parse(rawData1);

const rawData2 = fs.readFileSync("issues.json");
const data2 = JSON.parse(rawData2);

// Find differences between the datasets
const differences = findDifferences(data1, data2);

//  Print the results in a pretty format
console.log("Differences in occurrences for techniques:");
console.log(differences);

