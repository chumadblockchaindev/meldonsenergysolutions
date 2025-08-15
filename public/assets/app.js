 // Global variables
        let map;
        let marker;
        let directionsRenderer;
        
        // Initialize the map
        async function initMap() {
            try {
                // Check if Google Maps API is loaded
                if (!window.google || !google.maps) {
                    throw new Error('Google Maps API failed to load');
                }
                
                // Request needed libraries
                const { Map } = await google.maps.importLibrary("maps");
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
                const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
                
                // Coordinates for 27 Sanusi Fafunwa Street (approximate)
                const location = { lat: 6.4281, lng: 3.4219 };
                
                // Create the map
                map = new Map(document.getElementById("map"), {
                    zoom: 17,
                    center: location,
                    mapId: "DEMO_MAP_ID",
                    streetViewControl: true,
                    mapTypeControl: true
                });
                
                // Create the marker using AdvancedMarkerElement
                marker = new AdvancedMarkerElement({
                    position: location,
                    map: map,
                    title: "27 Sanusi Fafunwa Street, Victoria Island, Lagos"
                });
                
                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div style="padding: 10px;">
                                <h6 style="margin-bottom: 5px;">Our Location</h6>
                                <p style="margin: 0;">27 Sanusi Fafunwa Street<br>Victoria Island, Lagos</p>
                              </div>`
                });
                
                // Open info window on marker click
                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
                
                // Initialize directions renderer
                directionsRenderer = new DirectionsRenderer();
                
                // Get Directions button functionality
                document.getElementById("getDirections").addEventListener("click", function() {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=27+Sanusi+Fafunwa+Street,Victoria+Island,Lagos`;
                    window.open(url, "_blank");
                });
                
                // Try HTML5 geolocation to center on user
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            
                            // Add user location marker
                            new AdvancedMarkerElement({
                                position: userLocation,
                                map: map,
                                title: "Your Location"
                            });
                            
                            // Draw route if requested
                            const directionsService = new DirectionsService();
                            directionsRenderer.setMap(map);
                            
                            directionsService.route(
                                {
                                    origin: userLocation,
                                    destination: location,
                                    travelMode: google.maps.TravelMode.DRIVING
                                },
                                (response, status) => {
                                    if (status === "OK") {
                                        directionsRenderer.setDirections(response);
                                    } else {
                                        console.error("Directions request failed:", status);
                                    }
                                }
                            );
                        },
                        (error) => {
                            console.log("Geolocation error:", error.message);
                        },
                        { timeout: 10000 } // 10 second timeout
                    );
                }
            } catch (error) {
                console.error("Map initialization error:", error);
                showMapError("Failed to load map. Please try again later.");
            }
        }
        
        // Show error message
        function showMapError(message) {
            const errorElement = document.getElementById("map-error");
            errorElement.textContent = message;
            errorElement.classList.remove("d-none");
        }
        
        // Load the Google Maps API
        function loadGoogleMaps() {
            try {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&loading=async&libraries=places,marker,routes&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.onerror = () => {
                    showMapError("Failed to load Google Maps. Please check your internet connection.");
                };
                document.head.appendChild(script);
            } catch (error) {
                showMapError("Error loading map resources.");
                console.error("Script loading error:", error);
            }
        }
        
        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', loadGoogleMaps);