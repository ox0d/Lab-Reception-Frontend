const app = Vue.createApp({
  data: function () {
    return {
      backendBaseURL: "http://127.0.0.1:8000",

      action: "/barcode-generation",

      isPatientComponentVisible: false,
      isNewPatientFormComponentVisible: false,
      isDoctorComponentVisible: false,
      isTestComponentVisible: false,
      isBarcodeContainerVisible: false,

      faCaretLeft: "fa-caret-left",
      faCaretDown: "fa-caret-down",

      newPatientId: 0,

      selectedPatient: "",
      selectedDoctor: "",
      selectedTests: {},

      newAppointment: {
        patient_id: "",
        doctor_id: "",
        test_ids: [],
        barcode: "fff",
      },

      toastMessage: "",
    };
  },
  methods: {
    submitForm: async function () {
      // Reset component visibility state
      this.updateTestComponentVisibilityState();

      try {
        this.isBarcodeContainerVisible = false;
        // Generate a random unique barcode
        this.newAppointment.barcode = this.generateRandomBarcode();
        this.updateBarcodeContainerVisibilityState();

        // Store
        const response = await axios.post(
          this.backendBaseURL + this.action,
          this.newAppointment
        );
        let responseObject = response.data;
        // console.log(responseObject);

        if (responseObject.message == "Appointment scheduled successfully") {
          // Show and generate barcode image
          this.generateBarcodeImage();

          // Clear newAppointment data
          this.newAppointment.patient_id = "";
          this.newAppointment.doctor_id = "";
          this.newAppointment.test_ids = [];
          this.newAppointment.barcode = "";

          // Display success message to the user
          // console.log('Appointment scheduled successfully.');
          this.toastMessage = "Appointment scheduled successfully.";

          // Handle the toast display
          var toast = new bootstrap.Toast(document.querySelector(".toast"));
          toast.show();

          this.$refs.doctorSelector.resetSelectedDoctor();
          this.$refs.patientSelector.resetSelectedPatient();
        } else {
          // Display error message to the user
          alert(responseObject.error);
          this.updateBarcodeContainerVisibilityState();
        }
      } catch (error) {
        console.error(error);
        // Display error message to the user
        alert("An error occurred. Please try again later.");
        this.updateBarcodeContainerVisibilityState();
      }
    },

    updatePatientComponentVisibilityState: function () {
      if (this.isPatientComponentVisible) {
        this.isPatientComponentVisible = false;
        return;
      }
      this.isPatientComponentVisible = true;
    },
    updateNewPatientFormComponentVisibilityState: function () {
      if (this.isNewPatientFormComponentVisible) {
        this.isNewPatientFormComponentVisible = false;
        return;
      }
      this.isNewPatientFormComponentVisible = true;
    },
    updateDoctorComponentVisibilityState: function () {
      if (this.isDoctorComponentVisible) {
        this.isDoctorComponentVisible = false;
        return;
      }
      this.isDoctorComponentVisible = true;
    },
    updateTestComponentVisibilityState: function () {
      if (this.isTestComponentVisible) {
        this.isTestComponentVisible = false;
        return;
      }
      this.isTestComponentVisible = true;
    },
    updateBarcodeContainerVisibilityState: function () {
      if (this.isBarcodeContainerVisible) {
        this.isBarcodeContainerVisible = false;
        return;
      }
      this.isBarcodeContainerVisible = true;
    },

    updateNewPatientId: function (id) {
      this.newPatientId = id;
    },

    addToSelectedPatient: function (selectedPatient) {
      this.newAppointment.patient_id = selectedPatient;
    },

    addToSelectedDoctor: function (selectedDoctor) {
      this.newAppointment.doctor_id = selectedDoctor;
    },

    addToSelectedTests: function (selectedTests) {
      const arrayWithDuplicates = selectedTests;
      const uniqueArray = arrayWithDuplicates.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      this.newAppointment.test_ids = uniqueArray;
    },

    updateToastMessage: function (toastMessage) {
      this.toastMessage = toastMessage;

      // Handle the toast display
      var toast = new bootstrap.Toast(document.querySelector(".toast"));
      toast.show();
    },

    generateRandomBarcode: function () {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const length = 6;
      let barcode = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        barcode += characters[randomIndex];
      }
      return barcode;
    },

    generateBarcodeImage: function () {
      if (this.newAppointment.barcode != "") {
        JsBarcode("#barcode", this.newAppointment.barcode);
        return;
      }
      console.log("Barcode is empty!");
    },

    saveBarcode: function () {
      // Get the canvas element
      const canvas = document.getElementById("barcode");

      if (canvas) {
        // Convert canvas content to data URL
        const dataURL = canvas.toDataURL("image/png");

        // Create an anchor element to simulate download
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "barcode.png"; // Set the desired file name

        // Trigger a "click" event on the anchor element
        link.dispatchEvent(new MouseEvent("click"));
      } else {
        console.log("Barcode canvas not found. Cannot save.");
      }
    },

    printBarcode: function () {
      // Get the canvas element
      const canvas = document.getElementById("barcode");

      if (canvas) {
        // Convert canvas content to data URL
        const dataURL = canvas.toDataURL("image/png");

        // Create a new window to display the barcode image for printing
        const printWindow = window.open("", "_blank", "width=400,height=300");

        // Set the content of the new window to the barcode image
        const barcodeImage = new Image();
        barcodeImage.src = dataURL;
        printWindow.document.write(barcodeImage.outerHTML);
        printWindow.document.close();

        // Print the window
        printWindow.print();
      } else {
        console.log("Barcode canvas not found. Cannot print.");
      }
    },
  },
});
