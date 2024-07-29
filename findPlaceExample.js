// const YOUR_GOOGLE_PLACES_API_KEY = 'AIzaSyC-Jq692uT-dX3pGNbwbHMMd6GPANrfrg4';

function findPlace() {
    // Manually input court name, city, and state
    const courtName = "Sawyer Point Pickleball Courts";
    const city = "Cincinnati";
    const state = "Ohio";
    
    // Combine the inputs into a single query
    const query = courtName + ", " + city + ", " + state;
    
    // Your API key
    const apiKey = GOOGLE_MAPS_API_KEY;
    
    // Construct the request URL for Find Place request
    const findPlaceUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?" +
              "input=" + encodeURIComponent(query) +
              "&inputtype=textquery" +
              "&fields=place_id,name,formatted_address,geometry" +
              "&key=" + apiKey;
    
    // Make the Find Place API request
    const response = UrlFetchApp.fetch(findPlaceUrl);
    
    // Parse the response
    const json = JSON.parse(response.getContentText());
    
    // Check if a place was found
    if (json.candidates && json.candidates.length > 0) {
      const place = json.candidates[0];
      Logger.log("Place found:");
      Logger.log("Name: " + place.name);
      Logger.log("Address: " + place.formatted_address);
      Logger.log("Location: " + place.geometry.location.lat + ", " + place.geometry.location.lng);
      
      // Get place details using the place_id
      const placeId = place.place_id;
      const detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?" +
                         "place_id=" + placeId +
                         "&fields=name,formatted_address,geometry,opening_hours,website,formatted_phone_number" +
                         "&key=" + apiKey;
      
      const detailsResponse = UrlFetchApp.fetch(detailsUrl);
      const detailsJson = JSON.parse(detailsResponse.getContentText());
      
      if (detailsJson.result) {
        const details = detailsJson.result;
        Logger.log("Website: " + (details.website || "N/A"));
        Logger.log("Phone Number: " + (details.formatted_phone_number || "N/A"));
        if (details.opening_hours && details.opening_hours.weekday_text) {
          Logger.log("Hours: " + details.opening_hours.weekday_text.join(", "));
        } else {
          Logger.log("Hours: N/A");
        }
      } else {
        Logger.log("No additional details found for the place.");
      }
    } else {
      Logger.log("No place found for the given query.");
    }
  }
  
  