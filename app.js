const map = new maplibregl.Map({
    style: `https://tiles.openfreemap.org/styles/bright`,
    center: [-93.23299752640466, 44.970787925016175],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    canvasContextAttributes: { antialias: true }
});

// The 'building' layer in the streets vector source contains building-height data from OpenStreetMap.
map.on('load', () => {
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

//  SIDEBAR AND MODALS 
const menuButton = document.getElementById('menu-button');
const sidebar = document.getElementById('sidebar');
const logoClose = document.getElementById('logo-close');
const parkingSuggestionBtn = document.getElementById('parking-suggestion-btn');
const newParkingSuggestionModal = document.getElementById('new_parking_suggestion_modal');
const suggestionSubmitBtn = document.querySelector('.modal-submit-btn');
const modalClose = document.querySelector(".modal-close-btn");

// Open sidebar
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

// Open parking suggestion modal
if (parkingSuggestionBtn) {
    parkingSuggestionBtn.addEventListener('click', () => {
        newParkingSuggestionModal.classList.add('open');
        parkingSuggestionBtn.classList.add('active-glow');
    });
}

// Close parking suggestion modal
if (modalClose || parkingSuggestionBtn) {
    modalClose.addEventListener('click', () => {
        newParkingSuggestionModal.classList.remove('open');
    });
}

// Submit parking suggestion
if (suggestionSubmitBtn) {
    suggestionSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        newParkingSuggestionModal.classList.remove('open');
        parkingSuggestionBtn.classList.remove('active-glow');
    });
}

//  AUTHENTICATION 

// Modal elements
const loginModal = document.getElementById('login-modal');
const profileModal = document.getElementById('profile-modal');
const loginBtn = document.getElementById('login-btn');
const loginModalClose = document.getElementById('login-modal-close');
const googleSigninBtn = document.getElementById('google-signin-btn');
const logoutBtn = document.getElementById('logout-btn');
const profileForm = document.getElementById('profile-form');

// User section elements
const notLoggedIn = document.getElementById('not-logged-in');
const loggedIn = document.getElementById('logged-in');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');

// Check authentication status on page load
async function checkAuth() {
    try {
        const response = await fetch('/api/current-user');
        const data = await response.json();
        
        if (data.authenticated) {
            showLoggedIn(data.user);
            
            // Check if profile is complete
            if (!data.user.major || !data.user.grade_level || !data.user.housing_type) {
                profileModal.classList.add('open');
            }
        } else {
            showNotLoggedIn();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showNotLoggedIn();
    }
}

function showLoggedIn(user) {
    notLoggedIn.style.display = 'none';
    loggedIn.style.display = 'flex';
    
    userAvatar.src = user.profile_pic || 'https://via.placeholder.com/48';
    userName.textContent = `${user.first_name} ${user.last_name}`;
    userEmail.textContent = user.email;
}

function showNotLoggedIn() {
    notLoggedIn.style.display = 'block';
    loggedIn.style.display = 'none';
}

// Open login modal
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('open');
    });
}

// Close login modal
if (loginModalClose) {
    loginModalClose.addEventListener('click', () => {
        loginModal.classList.remove('open');
    });
}

// Google Sign In
if (googleSigninBtn) {
    googleSigninBtn.addEventListener('click', () => {
        window.location.href = '/login';
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        window.location.href = '/logout';
    });
}

// Submit profile form
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const profileData = {
            major: document.getElementById('major-input').value,
            grade_level: document.getElementById('grade-level-input').value,
            graduation_year: parseInt(document.getElementById('graduation-year-input').value),
            housing_type: document.getElementById('housing-type-input').value
        };
        
        try {
            const response = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                profileModal.classList.remove('open');
                alert('Profile updated successfully!');
                checkAuth();
            } else {
                alert('Failed to update profile: ' + data.message);
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            alert('Failed to update profile');
        }
    });
}

// Check auth on page load
checkAuth();

//  FILTER FUNCTIONALITY 

const parkingTypeFilter = document.getElementById('parking-type-select');
const campusLocationFilter = document.getElementById('campus-location-select');
const maxCostRange = document.getElementById('max-cost-range');
const costDisplay = document.getElementById('cost-display');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

// Update cost display when slider moves
if (maxCostRange && costDisplay) {
    maxCostRange.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        costDisplay.textContent = `$${value.toFixed(2)}/hr`;
    });
}

// Apply filters
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', async () => {
        const parkingType = parkingTypeFilter.value;
        const campus = campusLocationFilter.value;
        const maxCost = maxCostRange.value;

        // Build query string
        const params = new URLSearchParams();
        if (campus) params.append('campus', campus);
        if (parkingType) params.append('type', parkingType);
        if (maxCost < 5) params.append('max_cost', maxCost);

        try {
            const response = await fetch(`/api/parking-spots/filter?${params.toString()}`);
            const data = await response.json();

            if (data.status === 'success') {
                console.log(`Found ${data.count} parking spots:`, data.data);
                // TODO: Update the parking spots display (we'll do this in Phase 3)
                alert(`Found ${data.count} parking spots matching your filters!`);
            }
        } catch (error) {
            console.error('Filter error:', error);
        }
    });
}

// Clear filters
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        parkingTypeFilter.value = '';
        campusLocationFilter.value = '';
        maxCostRange.value = 5;
        costDisplay.textContent = '$5.00/hr';
                
    });
}

// ============= DISPLAY SUGGESTED PARKING SPOTS =============
// ============= PARKING SPOT PIN =============


