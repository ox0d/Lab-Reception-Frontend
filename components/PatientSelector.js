app.component("patient-selector", {
  props: {
    baseurl: {
      type: String,
      required: true,
    },
    newpatientid: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  emits: ["show-patient-form", "selected-patient"],
  data: function () {
    return {
      action: "/patients",

      patients: [], // Array to store fetched patients
      selectedPatient: "",

      pageSize: 5, // Number of rows per page
      currentPage: 1, // Current page number

      searchTermById: "",
      searchTermByFullName: "",
      searchTermByPhoneNumber: "",

      patientsByIdState: false,
      patientsByFullNameState: false,
      patientsByPhoneNumberState: false,

      isIdInputDisabled: false,
      isFullNameInputDisabled: false,
      isPhoneNumberInputDisabled: false,

      addNewPatientState: false,

      newPatientState: true,
      oldPatientid: 0,

      formErrors: {
        searchTermById: "",
        searchTermByFullName: "",
        searchTermByPhoneNumber: "",
      },
    };
  },
  methods: {
    fetchPatients: async function () {
      try {
        const response = await axios.get(this.baseurl + this.action);

        // Processing patient data as needed
        this.patients = response.data;
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    },

    resetSelectedPatient: function () {
      this.selectedPatient = ""; // Reset selected patient when called
    },

    updatePatientsByIdState: function () {
      this.formErrors.searchTermById = "";
      if (this.searchTermById && !/^\d+$/.test(this.searchTermById)) {
        this.formErrors.searchTermById =
          "Invalid ID format. Only digits are allowed.";
        return;
      }

      if (this.searchTermById == "") {
        this.patientsByIdState = false;

        // Update each input disabled state
        this.isFullNameInputDisabled = false;
        this.isPhoneNumberInputDisabled = false;

        return;
      }
      this.patientsByIdState = true;

      // Update each input disabled state
      this.isFullNameInputDisabled = true;
      this.isPhoneNumberInputDisabled = true;
    },

    updatePatientsByFullNameState: function () {
      this.formErrors.searchTermByFullName = "";
      if (
        this.searchTermByFullName &&
        !/^[a-zA-Z\s]+$/.test(this.searchTermByFullName)
      ) {
        this.formErrors.searchTermByFullName =
          "Invalid characters in Full Name.";
        return;
      }

      if (this.searchTermByFullName == "") {
        this.patientsByFullNameState = false;

        // Update each input disabled state
        this.isIdInputDisabled = false;
        this.isPhoneNumberInputDisabled = false;

        return;
      }

      this.patientsByFullNameState = true;

      // Update each input disabled state
      this.isIdInputDisabled = true;
      this.isPhoneNumberInputDisabled = true;
    },

    updatePatientsByPhoneNumberState: function () {
      this.formErrors.searchTermByPhoneNumber = "";
      if (
        this.searchTermByPhoneNumber &&
        !/^[0-9]+$/.test(this.searchTermByPhoneNumber)
      ) {
        this.formErrors.searchTermByPhoneNumber =
          "Phone Number should contain only digits.";
        return;
      }

      if (this.searchTermByPhoneNumber == "") {
        this.patientsByPhoneNumberState = false;

        // Update each input disabled state
        this.isIdInputDisabled = false;
        this.isFullNameInputDisabled = false;

        return;
      }

      this.patientsByPhoneNumberState = true;

      // Update each input disabled state
      this.isIdInputDisabled = true;
      this.isFullNameInputDisabled = true;
    },

    changePage: function (pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.pageCount) {
        this.currentPage = pageNumber;
      }
    },

    showNewPatientForm: function () {
      // Show form for adding a new patient
      this.$emit("show-patient-form");
    },
  },
  computed: {
    filteredPatientsById: function () {
      if (this.searchTermById === "") {
        return []; // Return an empty array when no search term is entered
      }

      const searchTerm = this.searchTermById;
      const filteredPatients = this.patients.filter((patient) => {
        return patient.id.toString().includes(searchTerm.trim());
      });

      if (filteredPatients.length === 0) {
        this.addNewPatientState = true;
        return;
      }

      this.addNewPatientState = false;
      return filteredPatients; // Return the filtered array
    },

    filteredPatientsByFullName: function () {
      if (this.searchTermByFullName === "") {
        return []; // Return an empty array when no search term is entered
      }

      const searchTerm = this.searchTermByFullName.toLowerCase();
      const filteredPatients = this.patients.filter((patient) => {
        return patient.full_name.toLowerCase().includes(searchTerm.trim());
      });

      if (filteredPatients.length === 0) {
        this.addNewPatientState = true;
        return;
      }

      this.addNewPatientState = false;
      return filteredPatients; // Return the filtered array
    },

    filteredPatientsByPhoneNumber: function () {
      if (this.searchTermByPhoneNumber === "") {
        return []; // Return an empty array when no search term is entered
      }

      const searchTerm = this.searchTermByPhoneNumber;
      const filteredPatients = this.patients.filter((patient) => {
        return patient.phone_number.includes(searchTerm.trim());
      });

      if (filteredPatients.length === 0) {
        this.addNewPatientState = true;
        return;
      }

      this.addNewPatientState = false;
      return filteredPatients; // Return the filtered array
    },

    pageCount: function () {
      return Math.ceil(this.patients.length / this.pageSize);
    },

    displayedPatients: function () {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.patients.slice(startIndex, endIndex);
    },
  },

  updated: function () {
    if (this.selectedPatient == "" && this.newpatientid <= 0) {
      this.$emit("selected-patient", "");
      return;
    } else {
      this.$emit("selected-patient", this.selectedPatient);
    }

    if (this.newpatientid != this.oldPatientid) {
      this.newPatientState = true;
    }

    if (this.newpatientid > 0 && this.newPatientState == true) {
      this.oldPatientid = this.newpatientid;

      this.fetchPatients();

      this.selectedPatient = this.newpatientid; // Automatically select the new patient
      this.$emit("selected-patient", this.newpatientid);

      this.newPatientState = false;
    }
  },

  mounted: function () {
    this.fetchPatients(); // Fetch patients when component is mounted
  },

  template:
    /*html*/
    `
    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12 table-responsive">
            <h3>Patients List</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Birthday</th>
                        <th>Phone Number</th>
                        <th>Gender</th>                
                        <th>Note</th>                
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(patient, index) in displayedPatients" :key="patient.id">
                        <td>{{ patient.id }}</td>
                        <td>{{ patient.full_name }}</td>
                        <td>{{ patient.birthday_date }}</td>
                        <td>{{ patient.phone_number }}</td>
                        <td>{{ patient.gender }}</td>
                        <td>{{ patient.note }}</td>
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
            <h3>Select Patient</h3>
        </div>
        <div class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <select class="form-select" v-model="selectedPatient" id="selectedPatient1">
                <option value="">Select a patient</option>
                <option v-for="patient in patients" v-bind:key="patient.id" v-bind:value="patient.id">
                    {{ patient.full_name }}
                </option>
            </select>
        </div>
    </div>

    <div class="row border border-1 shadow-sm rounded my-4 py-4 px-2">
        <div class="col-12">
            <h3>Search Patients</h3>
        </div>

        <div class="ccol-12 col-sm-6 col-lg-4">
            <label  class="form-label" for="patient-search-id">Search patient by "id":</label>
            <input 
                class="form-control"
                v-model="searchTermById"
                v-on:input="updatePatientsByIdState"
                id="patient-search-id"
                v-bind:disabled="isIdInputDisabled"
                v-bind:placeholder="[ isIdInputDisabled ? 'Disabled input' : '']"
            />  
            <small class="text-danger mb-4">{{ formErrors.searchTermById }}</small>   
        </div>

        <div class="ccol-12 col-sm-6 col-lg-4">
            <label  class="form-label" for="patient-search-name">Search patient by "full name":</label>
            <input 
                class="form-control" 
                v-model="searchTermByFullName" 
                v-on:input="updatePatientsByFullNameState" 
                id="patient-search-name" 
                v-bind:disabled="isFullNameInputDisabled" 
                v-bind:placeholder="[ isFullNameInputDisabled ? 'Disabled input' : '']"
            />
            <small class="text-danger">{{ formErrors.searchTermByFullName }}</small>
        </div>

        <div class="ccol-12 col-sm-6 col-lg-4">
            <label  class="form-label" for="patient-search-phoneNumber">Search patient by "phone number":</label>
            <input 
                class="form-control" 
                v-model="searchTermByPhoneNumber" 
                v-on:input="updatePatientsByPhoneNumberState" 
                id="patient-search-phoneNumber" 
                v-bind:disabled="isPhoneNumberInputDisabled" 
                v-bind:placeholder="[ isPhoneNumberInputDisabled ? 'Disabled input' : '']"
            />
            <small class="text-danger">{{ formErrors.searchTermByPhoneNumber }}</small>
        </div>

        <div class="col-12 mt-2" v-if="addNewPatientState">
            <div class="row">
                <div class="col-12">
                <p class="text-danger mt-2">
                    No patients match the search criteria. You can <u>add a new patient</u> if needed.
                </p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <button v-on:click="showNewPatientForm" class="btn btn-primary">Add New Patient</button>
                </div>
            </div>

            <p style="display: none;"> 
                {{filteredPatientsById}}
                {{filteredPatientsByFullName}}
                {{filteredPatientsByPhoneNumber}}
            </p>
      </div>

      <div class="col-12 mt-4 table-responsive" v-else>
      <table class="table table-bordered" v-if="patientsByIdState || patientsByFullNameState || patientsByPhoneNumberState">
        <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Birthday</th>
                    <th>Phone Number</th>
                    <th>Gender</th>                
                    <th>Note</th>
                    <th>Select</th>            
                </tr>
            </thead>
            <tbody>
                <tr v-if="patientsByIdState" v-for="patient in filteredPatientsById">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.full_name }}</td>
                    <td>{{ patient.birthday_date }}</td>
                    <td>{{ patient.phone_number }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.note }}</td>
                    <td>
                        <input id="patient.id" class="form-check-input" type="radio" name="selectPatient" v-bind:value="patient.id" v-model="selectedPatient">                        
                    </td>
                </tr>
                <tr v-else-if="patientsByFullNameState" v-for="patient in filteredPatientsByFullName">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.full_name }}</td>
                    <td>{{ patient.birthday_date }}</td>
                    <td>{{ patient.phone_number }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.note }}</td>
                    <td>
                        <input id="patient.id" class="form-check-input" type="radio" name="selectPatient" v-bind:value="patient.id" v-model="selectedPatient">                        
                    </td>
                </tr>
                <tr v-else v-for="patient in filteredPatientsByPhoneNumber">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.full_name }}</td>
                    <td>{{ patient.birthday_date }}</td>
                    <td>{{ patient.phone_number }}</td>
                    <td>{{ patient.gender }}</td>
                    <td>{{ patient.note }}</td>
                    <td>
                        <input id="patient.id" class="form-check-input" type="radio" name="selectPatient" v-bind:value="patient.id" v-model="selectedPatient">                        
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
    `,
});
