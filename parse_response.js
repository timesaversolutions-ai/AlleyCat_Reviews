const fs = require('fs');

// Function to parse transcribed text
function parseTranscribedText(transcribedText) {
  if (!transcribedText) {
    throw new Error("No transcribed text provided");
  }

  console.log("Transcribed Text:\n", transcribedText);

  var lines = transcribedText.split('.'); // Splitting sentences by period
  var parsedData = {
    state: "",
    city: "",
    court: "",
    permanent_lines: "",
    permanent_nets: "",
    paddle_rack: "",
    num_courts: "",
    skill_based: "",
    luxury_enhancements: "",
    additional_comments: ""
  };

  lines.forEach(line => {
    console.log("Processing line:", line);
    var lowerCaseLine = line.toLowerCase();

    if (lowerCaseLine.includes('state')) {
      parsedData.state += line.trim() + " ";
    }
    if (lowerCaseLine.includes('city')) {
      parsedData.city += line.trim() + " ";
    }
    if (lowerCaseLine.includes('court')) {
      parsedData.court += line.trim() + " ";
    }
    if (lowerCaseLine.includes('permanent lines')) {
      parsedData.permanent_lines += line.trim() + " ";
    }
    if (lowerCaseLine.includes('permanent nets')) {
      parsedData.permanent_nets += line.trim() + " ";
    }
    if (lowerCaseLine.includes('paddle racks')) {
      parsedData.paddle_rack += line.trim() + " ";
    }
    if (lowerCaseLine.includes('eight courts')) {
      parsedData.num_courts = "8";
    }
    if (lowerCaseLine.includes('skill differentiated play')) {
      parsedData.skill_based += line.trim() + " ";
    }
    if (lowerCaseLine.includes('higher-end courts')) {
      parsedData.luxury_enhancements += line.trim() + " ";
    }
    if (!(
      lowerCaseLine.includes('state') ||
      lowerCaseLine.includes('city') ||
      lowerCaseLine.includes('court') ||
      lowerCaseLine.includes('permanent lines') ||
      lowerCaseLine.includes('permanent nets') ||
      lowerCaseLine.includes('paddle racks') ||
      lowerCaseLine.includes('eight courts') ||
      lowerCaseLine.includes('skill differentiated play') ||
      lowerCaseLine.includes('higher-end courts')
    )) {
      parsedData.additional_comments += line.trim() + " ";
    }
  });

  // Trim any trailing spaces from the parsed data fields
  for (let key in parsedData) {
    parsedData[key] = parsedData[key].trim();
  }

  return parsedData;
}

// Read the response file
fs.readFile('response.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the response file:', err);
    return;
  }

  // Parse the JSON response
  let response;
  try {
    response = JSON.parse(data);
    console.log(response);
  } catch (parseErr) {
    console.error('Error parsing the response file:', parseErr);
    return;
  }

  // Check if the transcription field is present
  if (!response.text) {
    console.error('Transcription field is missing in the response');
    return;
  }

  // Extract the transcribed text
  const transcribedText = response.text;
  console.log("Transcribed Text:\n", transcribedText);

  // Parse the transcribed text
  let parsedData;
  try {
    parsedData = parseTranscribedText(transcribedText);
  } catch (parseErr) {
    console.error('Error parsing transcribed text:', parseErr);
    return;
  }

  console.log('Parsed Data:', parsedData);

  // Save the parsed data to a new JSON file
  fs.writeFile('parsed_response.json', JSON.stringify(parsedData, null, 2), (err) => {
    if (err) {
      console.error('Error writing the parsed response file:', err);
      return;
    }
    console.log('Parsed response saved to parsed_response.json');
  });
});
