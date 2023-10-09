// Get user's IP address and display information
fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        const userIP = data.ip;
        document.getElementById('ip-address').textContent = userIP;

        // Fetch user's information based on IP
        fetch(`https://ipinfo.io/${userIP}/geo`)
            .then(response => response.json())
            .then(ipData => {
                document.getElementById('latitude').textContent = ipData.loc.split(',')[0];
                document.getElementById('longitude').textContent = ipData.loc.split(',')[1];
                document.getElementById('city').textContent = ipData.city;
                document.getElementById('region').textContent = ipData.region;
                document.getElementById('timezone').textContent = ipData.timezone;

                // Show user's location on Google Maps
                const map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: parseFloat(ipData.loc.split(',')[0]), lng: parseFloat(ipData.loc.split(',')[1]) },
                    zoom: 10,
                });

                // Get current time based on user's timezone
                const currentTime = new Date().toLocaleString("en-US", { timeZone: ipData.timezone });
                document.getElementById('current-time').textContent = currentTime;

                // Get postal code from IP data and fetch post offices
                const pincode = ipData.postal;
                fetch(`https://api.postalpincode.in/pincode/${pincode}`)
                    .then(response => response.json())
                    .then(pincodeData => {
                        const postOffices = pincodeData[0].PostOffice;
                        const postOfficeList = document.getElementById('post-office-list');
                        postOfficeList.innerHTML = ''; // Clear existing list

                        // Create a list of post offices
                        postOffices.forEach(postOffice => {
                            const listItem = document.createElement('li');
                            listItem.textContent = `${postOffice.Name} (${postOffice.BranchType})`;
                            postOfficeList.appendChild(listItem);
                        });

                        // Search functionality
                        const searchBox = document.getElementById('search-box');
                        searchBox.addEventListener('input', () => {
                            const searchText = searchBox.value.toLowerCase();
                            postOfficeList.innerHTML = ''; // Clear existing list

                            postOffices.forEach(postOffice => {
                                const postOfficeName = postOffice.Name.toLowerCase();
                                const branchType = postOffice.BranchType.toLowerCase();

                                if (postOfficeName.includes(searchText) || branchType.includes(searchText)) {
                                    const listItem = document.createElement('li');
                                    listItem.textContent = `${postOffice.Name} (${postOffice.BranchType})`;
                                    postOfficeList.appendChild(listItem);
                                }
                            });
                        });
                    })
                    .catch(error => console.error('Error fetching post offices:', error));
            })
            .catch(error => console.error('Error fetching IP information:', error));
    })
    .catch(error => console.error('Error fetching IP address:', error));
