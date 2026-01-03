const map = new maplibregl.Map({
            style: `https://tiles.openfreemap.org/styles/bright`,
            center: [-93.23299752640466, 44.970787925016175],
            zoom: 15.5,
            pitch: 45,
            bearing: -17.6,
            container: 'map',
            canvasContextAttributes: { antialias: true }
        });

        // The 'building' layer in the streets vector source contains building-height
        // data from OpenStreetMap.
        map.on('load', () => {
            // Insert the layer beneath any symbol layer.
            const layers = map.getStyle().layers;

            let labelLayerId;
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            map.addSource('openfreemap', {
                url: `https://tiles.openfreemap.org/planet`,
                type: 'vector',
            });

            map.addLayer(
                {
                    'id': '3d-buildings',
                    'source': 'openfreemap',
                    'source-layer': 'building',
                    'type': 'fill-extrusion',
                    'minzoom': 15.5,
                    'filter': ['!=', ['get', 'hide_3d'], true],
                    'paint': {
                        'fill-extrusion-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
                        ],
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            16,
                            ['get', 'render_height']
                        ],
                        'fill-extrusion-base': ['case',
                            ['>=', ['get', 'zoom'], 16],
                            ['get', 'render_min_height'], 0
                        ]
                    }
                },
                labelLayerId
            );
        });

        // ... after map code ...

        //Sidebar and Modal variables
        const menuButton = document.getElementById('menu-button');
        const sidebar = document.getElementById('sidebar');
        const logoClose = document.getElementById('logo-close');
        const parkingSuggestionBtn = document.getElementById('parking-suggestion-btn');
        const newParkingSuggestionModal = document.getElementById('new_parking_suggestion_modal');
        const suggestionSubmitBtn = document.querySelector('.modal-submit-btn');
        const modalClose = document.querySelector(".modal-close-btn"); // Ensure you use the correct ID: modal-close-btn

        // Open sidebar (logic remains the same)
        if (menuButton && sidebar && parkingSuggestionBtn) {
            menuButton.addEventListener('click', () => {
                sidebar.classList.add('open');
                menuButton.classList.add('hidden');
                parkingSuggestionBtn.classList.add('visible');
                menuButton.classList.add('active');
            });
        }

        // Close sidebar 
        if (logoClose && sidebar && menuButton && parkingSuggestionBtn) {
            logoClose.addEventListener('click', () => {
                sidebar.classList.remove('open');
                menuButton.classList.remove('hidden');
                parkingSuggestionBtn.classList.remove('visible');
                menuButton.classList.remove('active');
            });
        }

        // Open modal
        if (parkingSuggestionBtn) {
            parkingSuggestionBtn.addEventListener('click', () => {
                newParkingSuggestionModal.classList.add('open');
                parkingSuggestionBtn.classList.add('active-glow');
            });
        }

        // Close modal 
        if (modalClose || parkingSuggestionBtn) {
            modalClose.addEventListener('click', () => {
                newParkingSuggestionModal.classList.remove('open');
            });
        }

        // Submit button closes the modal
        if (suggestionSubmitBtn) {
            suggestionSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent page reload/form submission
                newParkingSuggestionModal.classList.remove('open');
                parkingSuggestionBtn.classList.remove('active-glow');
                // future form submison logic 
            });
        }