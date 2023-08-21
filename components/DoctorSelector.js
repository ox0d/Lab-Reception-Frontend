app.component('doctor-selector', {
    props: {
        baseurl: {
            type: String,
            required: true,
        }
    },
    emits: ['selected-doctor'],
    data: function() {
        return {
            action: '/doctors',
            
            doctors: [], // Array to store fetched doctors
            selectedDoctor: '',

            pageSize: 5, // Number of rows per page
            currentPage: 1, // Current page number
            
            searchTermById: '',
            searchTermByFullName: '',
            searchTermByPhoneNumber: '',

            doctorsByIdState: false,
            doctorsByFullNameState: false,
            doctorsByPhoneNumberState: false,

            isIdInputDisabled: false,
            isFullNameInputDisabled: false,
            isPhoneNumberInputDisabled: false,

            addNewDoctorState: false,
        };
    },
    methods: {
        fetchDoctors: async function() {
            try {
            const response = await axios.get(this.baseurl + this.action);

            // Processing doctor data as needed
            this.doctors = response.data;
            } catch (error) {
            console.error('Error fetching doctors:', error);
            }
        },
        
        updateDoctorsByIdState: function() {
            if (this.searchTermById == '') {
                this.doctorsByIdState = false;

                // Update each input disabled state
                this.isFullNameInputDisabled = false;
                this.isPhoneNumberInputDisabled = false;

                return;
            }
            this.doctorsByIdState = true;

            // Update each input disabled state
            this.isFullNameInputDisabled = true;
            this.isPhoneNumberInputDisabled = true;
        },
        
        updateDoctorsByFullNameState: function() {
            if (this.searchTermByFullName == '') {
                this.doctorsByFullNameState = false;

                // Update each input disabled state
                this.isIdInputDisabled = false;
                this.isPhoneNumberInputDisabled = false;

                return;
            }
            
            this.doctorsByFullNameState = true;

            // Update each input disabled state
            this.isIdInputDisabled = true;
            this.isPhoneNumberInputDisabled = true;
        },

        updateDoctorsByPhoneNumberState: function() {
            if (this.searchTermByPhoneNumber == '') {
                this.doctorsByPhoneNumberState = false;

                // Update each input disabled state
                this.isIdInputDisabled = false;
                this.isFullNameInputDisabled = false;

                return;
            }

            this.doctorsByPhoneNumberState = true;

            // Update each input disabled state
            this.isIdInputDisabled = true;
            this.isFullNameInputDisabled = true;
        },

        changePage: function(pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.pageCount) {
                this.currentPage = pageNumber;
            }
        }
      },
      computed: {
        filteredDoctorsById: function() {
            if (this.searchTermById === '') {
                return []; // Return an empty array when no search term is entered
            }
          
            const searchTerm = this.searchTermById;
            const filteredDoctors = this.doctors.filter(doctor => {
              return doctor.id.toString().includes(searchTerm.trim());
            });
          
            if (filteredDoctors.length === 0) {
                this.addNewDoctorState = true;
                return;
            }          
            
            this.addNewDoctorState = false;
            return filteredDoctors; // Return the filtered array
        },  

        filteredDoctorsByFullName: function() {
            if (this.searchTermByFullName === '') {
                return []; // Return an empty array when no search term is entered
            }

            const searchTerm = this.searchTermByFullName.toLowerCase();
            const filteredDoctors =  this.doctors.filter(doctor => {
                return doctor.full_name.toLowerCase().includes(searchTerm.trim());
            });

            if (filteredDoctors.length === 0) {
                this.addNewDoctorState = true;
                return;
            }
                      
            this.addNewDoctorState = false;
            return filteredDoctors; // Return the filtered array
        },

        filteredDoctorsByPhoneNumber: function() {
            if (this.searchTermByPhoneNumber === '') {
                return []; // Return an empty array when no search term is entered
            }

            const searchTerm = this.searchTermByPhoneNumber;
            const filteredDoctors =  this.doctors.filter(doctor => {
                return doctor.phone_number.includes(searchTerm.trim());
            });

            if (filteredDoctors.length === 0) {
                this.addNewDoctorState = true;
                return;
            }
                      
            this.addNewDoctorState = false;
            return filteredDoctors; // Return the filtered array
        },

        pageCount: function() {
            return Math.ceil(this.doctors.length / this.pageSize);
        },

        displayedDoctors: function() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.doctors.slice(startIndex, endIndex);
        }
    },

    updated: function() {
        if (this.selectedDoctor == '') {
            this.$emit('selected-doctor', '');
            return;
        }
        this.$emit('selected-doctor', this.selectedDoctor);
    },

    mounted: function() {
    this.fetchDoctors(); // Fetch doctors when component is mounted
    },

    template:
    /*html*/
    `
    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12 table-responsive">
            <h3>Doctors List</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Phone Number</th>     
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(doctor, index) in displayedDoctors" v-bind:key="doctor.id">
                        <td>{{ doctor.id }}</td>
                        <td>{{ doctor.full_name }}</td>
                        <td>{{ doctor.phone_number }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="d-flex justify-content-center">
                <nav>
                    <ul class="pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item" v-for="page in pageCount" :key="page" :class="{ active: page === currentPage }">
                            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === pageCount }">
                            <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>            
            </div>

        </div>
    </div>

    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <h3>Select Doctor</h3>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-5 col-xl-4">
            <select class="form-select" v-model="selectedDoctor">
                <option value="">Select a doctor</option>
                <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                    {{ doctor.full_name }}
                </option>
            </select>
        </div>
    </div>

    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <h3>Search Doctors</h3>
        </div>

        <div class="col-md-12 col-lg-4">
            <label  class="form-label" for="doctor-search-id">Search doctor by "id":</label>
            <input class="form-control" v-model="searchTermById" v-on:input="updateDoctorsByIdState" id="doctor-search-id" v-bind:disabled="isIdInputDisabled" v-bind:placeholder="[ isIdInputDisabled ? 'Disabled input' : '']"/>     
        </div>

        <div class="col-md-12 col-lg-4">
            <label  class="form-label" for="doctor-search-name">Search doctor by "full name":</label>
            <input class="form-control" v-model="searchTermByFullName" v-on:input="updateDoctorsByFullNameState" id="doctor-search-name" v-bind:disabled="isFullNameInputDisabled" v-bind:placeholder="[ isFullNameInputDisabled ? 'Disabled input' : '']"/>
        </div>

        <div class="col-md-12 col-lg-4">
            <label  class="form-label" for="doctor-search-phoneNumber">Search doctor by "phone number":</label>
            <input class="form-control" v-model="searchTermByPhoneNumber" v-on:input="updateDoctorsByPhoneNumberState" id="doctor-search-phoneNumber" v-bind:disabled="isPhoneNumberInputDisabled" v-bind:placeholder="[ isPhoneNumberInputDisabled ? 'Disabled input' : '']"/>
        </div>

        <div class="col-12 mt-2" v-if="addNewDoctorState">
            <div class="row">
                <div class="col-12">
                <p class="text-danger mt-2">
                    No doctors match the search criteria.
                </p>
                </div>
            </div>

            <p style="display: none;"> 
                {{filteredDoctorsById}}
                {{filteredDoctorsByFullName}}
                {{filteredDoctorsByPhoneNumber}}
            </p>
      </div>

      <div class="col-12 mt-4 table-responsive" v-else>
      <table class="table table-bordered" v-if="doctorsByIdState || doctorsByFullNameState || doctorsByPhoneNumberState">
        <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Select</th>   
                </tr>
            </thead>
            <tbody>
                <tr v-if="doctorsByIdState" v-for="doctor in filteredDoctorsById">
                    <td>{{ doctor.id }}</td>
                    <td>{{ doctor.full_name }}</td>
                    <td>{{ doctor.phone_number }}</td>
                    <td>
                        <input class="form-check-input" type="radio" name="selectDoctor" v-bind:value="doctor.id" v-model="selectedDoctor">                        
                    </td>
                </tr>
                <tr v-else-if="doctorsByFullNameState" v-for="doctor in filteredDoctorsByFullName">
                    <td>{{ doctor.id }}</td>
                    <td>{{ doctor.full_name }}</td>
                    <td>{{ doctor.phone_number }}</td>
                    <td>
                        <input class="form-check-input" type="radio" name="selectDoctor" v-bind:value="doctor.id" v-model="selectedDoctor">                        
                    </td>
                </tr>
                <tr v-else v-for="doctor in filteredDoctorsByPhoneNumber">
                    <td>{{ doctor.id }}</td>
                    <td>{{ doctor.full_name }}</td>
                    <td>{{ doctor.phone_number }}</td>
                    <td>
                        <input class="form-check-input" type="radio" name="selectDoctor" v-bind:value="doctor.id" v-model="selectedDoctor">                        
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    `,
});