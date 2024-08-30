const prompt = {
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: `You are an agent which takes a transcripted message and outputs the relevant information in key value pairs as a json file to be uploaded to a google sheet. Here are the data points to parse for: Court, City, State, Permanent Lines, Permanent Nets, Paddle Rack (yes or no), Number of Courts, Ability or Skill Based Courts, Premium Amenities, Additional Enhancements, Additional Comments. 
        Ability or Skill Based Courts refers to whether a court (yes or no) separates courts by ratings of 3.0 and below (beginner) and 3.5 and up (advanced). Premium Amenities are whether a court offers (yes or no): Pro Shop, Snack Bar/Restaurant, Demo Paddles, Local Pro/Lessons, Ball Machine Rental. Additional Enhancements are whether a court offers (yes or no): Lights; Windscreens; Wind Flags; N/S Dividers; E/W Dividers; Restrooms; Water Fountain; Seating; Trash Recepticles; Recycling Stations; Ball Recycling; Parking; Parking visible from Courts; Defibrillator; Picnic Tables; Bike Racks (visible); Ambassador Contact (yes or no). Additional Comments contains any comments not used by other data points. No redundant info please.
        You also need to create an additional datapoint named 'AlleyCat Score', based on this criteria:
        Level 3: 6 courts minimum; Permanent Lines; Permanent Nets; Paddle Rack - Queue System
        Level 4: Skill Differentiated play
        Level 5: 12 Courts minimum; 2 or more Premium Amenities`
    },
    {
      role: "user",
      content: `Can you organize this transcripted message into json data? 
        Output should be a raw json file. 
        Message: "In the state of Ohio, I want to review the courts at Sawyer Point, so it's called Sawyer Point Pickleball Courts. It's in the city of, it's in Cincinnati. There are 18 dedicated courts with permanent lines, permanent nets. There's a paddle rack and a queue. With the 18 courts, there are also 6 courts that are striped on tennis courts for an additional courts, which are 24 courts in total. They have ability-based courts. The courts on the north side are for 3.5 plus players and above, and the courts on the south side are 1.0 to 3.0. They also have a challenge court, one challenge court for 3.5 level, one challenge court for the 1.0 to 3.0 level. Additional comments about this park. It has lights. It has wind flags. There are no east-west dividers, so the ball can roll 12 courts down, theoretically. They do have nice restrooms on the other side of the bleachers. There is a water fountain, and there is seating in the sun, but there is no shade. They have trash receptacles. They have parking. It is, the courts are free, but the parking is $5. The parking is visible from the courts, and though it is an outdoor court, they do have an ambassador. One of the finest things that I've seen at the court is that they have someone from the parks department that is there to facilitate the exchange of courts. There are picnic tables and a bike rack as part of the park facility where it's located."`
    },
    {
      role: "assistant",
      content: `{
          "Court": "Sawyer Point Pickleball Courts",
          "City": "Cincinnati",
          "State": "Ohio",
          "Permanent Lines": true,
          "Permanent Nets": true,
          "Paddle Rack": "true",
          "Number of Courts": 24,
          "Ability or Skill Based Courts": true,
          "Premium Amenities": {
              "Pro Shop": false,
              "Snack Bar/Restaurant": false,
              "Demo Paddles": false,
              "Local Pro/Lessons": false,
              "Ball Machine Rental": false
          },
          "Additional Enhancements": {
              "Lights": true,
              "Wind Flags": true,
              "N/S Dividers": false,
              "E/W Dividers": false,
              "Restrooms": true,
              "Water Fountain": true,
              "Seating": true,
              "Trash Recepticles": true,
              "Recycling Stations": false,
              "Ball Recycling": false,
              "Parking": true,
              "Parking visible from Courts": true,
              "Defibrillator": false,
              "Picnic Tables": false,
              "Bike Racks (visible)": false,
              "Ambassador Contact": true
          },
          "Additional Comments": "They do have nice restrooms on the other side of the bleachers. There is seating in the sun, but there is no shade. The parking is $5. One of the finest things that I've seen at the court is that they have someone from the parks department that is there to facilitate the exchange of courts.",
          "AlleyCat Score": 4
      }`
    },
    {
      role: "user",
      content: `Can you organize this transcripted message into json data? 
        Output should be a raw json file. Message: "This is a court review for the Pickle Lodge, an indoor facility in Westchester Township in Ohio. The Pickle Lodge has permanent lines and permanent nets with paddle racks and queues and they have 17 indoor courts. These courts are based on ability and you do need to call ahead to sign up to play. This is a high luxury indoor pickleball experience. They have lights. There's no need for windscreen since it's indoors and with flags. Every court is surrounded by fencing so there are east, west and north, south dividers on the courts. A beautiful restroom facility. They have a water fountain. There is seating, trash receptacles, recycling receptacles. There's lots of parking outdoors. Parking is not visible because this is an indoor facility. They have a snack bar. They have a full open bar. They've got a pro shop that sells attire, shoes, balls, shirts, everything. They have demo paddles. They have a defibrillator. They have picnic tables in the center and they have just a fine facility. This is probably the best designed indoor facility I have ever come in contact with in all the courts that I have visited."`,
    },
    {
      role: "assistant",
      content: `{
        "Court": "Pickle Lodge",
        "City": "Westchester Township",
        "State": "Ohio",
        "Permanent Lines": "true",
        "Permanent Nets": "true",
        "Paddle Rack": "true",
        "Number of Courts": 17,
        "Ability or Skill Based Courts": "true",
        "Premium Amenities": {
            "Pro Shop": "true",
            "Snack Bar/Restaurant": "true",
            "Demo Paddles": "true",
            "Local Pro/Lessons": "false",
            "Ball Machine Rental": "false"
        },
        "Additional Enhancements": {
            "Lights": "true",
            "Windscreens": "false",
            "Wind Flags": "false",
            "N/S Dividers": "true",
            "E/W Dividers": "true",
            "Restrooms": "true",
            "Water Fountain": "true",
            "Seating": "true",
            "Trash Receptacles": "true",
            "Recycling Stations": "true",
            "Parking": "true",
            "Parking visible from Courts": "false",
            "Defibrillator": "true",
            "Picnic Tables": "false",
            "Bike Racks (visible)": "false",
            "Ambassador Contact": "false"
        },
        "Additional Comments": "This is probably the best designed indoor facility.",
        "AlleyCat Score": 5
      }`
    },
    {
      role: "user",
      content: `Can you organize this transcripted message into json data? 
        Output should be a raw json file. Message: "We're going to review a park in the state of New York. The city is Bayside, which is a town in Queens. The facility is Crocheron Park, run by the New York City Parks Department. The facility has permanent lines and permanent nets. There is a paddle rack queue. There are six courts. They have ability-based playing system for beginner, intermediate, and advanced players. Additional comments here is they do not have lights. They do not have windscreens. There are no wind flags, and there are no dividers east-west between the courts, only north-south dividers. They have restrooms. There's a water fountain. There is plenty seating in the shade. They have trash receptacles, ball recycling. There is parking, and partially parking can be seen from the courts. They do not have a bike rack and no ambassador contact at this time."`,
    },
    {
      role: "assistant",
      content: `{
        "Court": "Crocheron Park",
        "City": "Bayside",
        "State": "New York",
        "Permanent Lines": "true",
        "Permanent Nets": "true",
        "Paddle Rack": "true",
        "Number of Courts": 6,
        "Ability or Skill Based Courts": "true",
        "Premium Amenities": {
            "Pro Shop": false,
            "Snack Bar/Restaurant": false,
            "Demo Paddles": false,
            "Local Pro/Lessons": false,
            "Ball Machine Rental": false
        },
        "Additional Enhancements": {
          "Lights": "false",
          "Windscreens": "false",
          "Wind Flags": "false",
          "N/S Dividers": "true",
          "E/W Dividers": "false",
          "Restrooms": "true",
          "Water Fountain": "true",
          "Seating": "true",
          "Trash Recepticles": "true",
          "Ball Recycling": "true",
          "Parking": "true",
          "Parking visible from Courts": "true",
          "Defibrillator": "false",
          "Picnic Tables": "false",
          "Bike Racks (visible)": "false",
          "Ambassador Contact": "false"
        },
        "Additional Comments": "They have ability-based playing system for beginner, intermediate, and advanced players. Facility is ran by the New York City Parks Department.",
        "AlleyCat Score": 3
      }`
    },
    {
      role: "user",
      content: `Can you organize this transcripted message into json data? 
        Output should be a raw json file. Message: "We're starting in Virginia. The city is Midlothian, which is a suburb of Richmond. The facility is Scott Pickleball Center at Rockwood Park. They have permanent lines and permanent nets. They have a paddle rack system to cue people for the courts. It is an eight court facility. They do not have ability-based courts. And additional comments is that they do have lights. They have wind screens and wind flags. A big bonus is the east-west dividers between courts. There is a restroom. They have seating around the courts. They have trash receptacles. They have ball recycling. They have parking. The parking is visible from the courts. There is a defibrillator. They have picnic tables. And there is an ambassador to contact."`,
    },
    {
      role: "assistant",
      content: `{
        "Court": "Scott Pickleball Center at Rockwood Park",
        "City": "Midlothian",
        "State": "Virginia",
        "Permanent Lines": "true",
        "Permanent Nets": "true",
        "Paddle Rack": "true",
        "Number of Courts": 8,
        "Ability or Skill Based Courts": "false",
        "Premium Amenities": {
          "Pro Shop": "false",
          "Snack Bar/Restaurant": "false",
          "Demo Paddles": "false",
          "Local Pro/Lessons": "false",
          "Ball Machine Rental": "false"
        },
        "Additional Enhancements": {
          "Lights": "true",
          "Windscreens": "true",
          "Wind Flags": "true",
          "N/S Dividers": "false",
          "E/W Dividers": "true",
          "Restrooms": "true",
          "Water Fountain": "false",
          "Seating": "true",
          "Trash Recepticles": "true",
          "Recycling Stations": "false",
          "Ball Recycling": "true",
          "Parking": "true",
          "Parking visible from Courts": "true",
          "Defibrillator": "true",
          "Picnic Tables": "true",
          "Bike Racks (visible)": "false",
          "Ambassador Contact": "true"
        },
        "Additional Comments": "None",
        "AlleyCat Score": 3
      }`
    },
    {
      role: "user",
      content: `Can you organize this transcripted message into json data? Output should be a raw json file. Message: ${transcriptionText}.`
    }
  ],
};
