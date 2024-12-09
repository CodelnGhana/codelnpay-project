<template>

  <a-form
      ref="formRef"

      :model="formState"
      name="Login"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
  >

    <!--- name--->
    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        has-feedback label="Company/Sender Name"
        name="name"
        :rules="[{ required: true, message: 'Please input your company name!' }]"
    >
      <a-input v-model:value="formState.name" placeholder="Company Name"/>
    </a-form-item>
    <!--- email--->
    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        has-feedback label="Email"
        name="company_email"
        :rules="[{ required: true, message: 'Please input employer email!' },{type:'email',message:'Input a valid email!'}]"
    >
      <a-input v-model:value="formState.company_email" placeholder="Email"/>
    </a-form-item>
    <!---phone--->


    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        has-feedback label="Phone number"
        name="phone_number"
        :rules="[{ required: true, },]"

    >
      <a-input v-model:value="formState.phone_number" @change="validatePhone" type="number">
        <template #addonBefore>
          <a-select
              @change="validatePhone"

              v-model:value="formState.code"
              style="width: 120px"
              placeholder="Code"
              :options="state.codesTelephone"


          ></a-select>
        </template>

      </a-input>
      <span slot="extra" style="color: red" v-if="state.phoneValid">
                    phone not valid
                  </span>


    </a-form-item>


    <!---country--->

    <a-form-item
        :label-col="{span:24}"
        :wrapper-col="{ span: 24 }"
        has-feedback label="Country"
        name="location"
        :rules="[{ required: true, message: 'Please pick your country!' }]"
    >

      <a-select
          show-search
          v-model:value="formState.location"
          style="width: 100%"
          placeholder="Country"
          :options="state.countries"
          :filter-option="filterCountries"

      ></a-select>

    </a-form-item>


    <!---proof of employment--->
    <a-form-item name="employment_letter"
                 label="Upload proof of employment or contract (PDF format only)"
                 :label-col="{span:24}"
                 :wrapper-col="{ span: 24 }"
                 :rules="[{ required: true, message: 'Please upload proof of employment!' }]"

    >

      <a-upload v-model:file-list="formState.employment_letter"
                accept="application/pdf"
                :custom-request="uploadLetter"
                :max-count="1"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          Upload
        </a-button>


      </a-upload>


    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="state.saving" :disabled="disabled">Save</a-button>
      <a-button style="margin-left: 10px" @click="cancelForm">Cancel</a-button>
    </a-form-item>
  </a-form>


</template>

<script>
import {FormattedCountryData, CountryCodeData} from '@/utils/sharedDataFormatters/Countries'


import {defineComponent, reactive, ref, onMounted, computed, watch} from 'vue';

import {UploadOutlined} from '@ant-design/icons-vue';
import axios from "axios";
import EmployersService from "../../../services/EmployeesService";
import {useStore} from 'vuex';
import {VueTelInput} from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import {PhoneNumberUtil} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();
export default defineComponent({

  props: ['currentCompany', 'pickedCompany'],
  emits: ['companyAdd', 'companyEdit', 'cancelForm'],
  components: {
    UploadOutlined, VueTelInput
  },
  setup: function (props, ctx) {
    const store = useStore();


    const state = reactive({

      saving: false,
      countries: FormattedCountryData,
      codesTelephone: CountryCodeData,
      phoneValid: false,
      phoneIsValid:false


    });


    const formRef = ref();
    let initialForm = {
      company_email: '',
      name: '',
      location: '',
      phone_number: '',
      code: '+234',
      employment_letter: []
    }
    let formState = reactive({
      company_email: '',
      name: '',
      location: '',
      phone_number: '',
      code: '+254',
      employment_letter: [],


    });


    onMounted(() => {

      if (props.currentCompany) {
        formatCurrentCompanyPropNumber(props.currentCompany.phone_number)
        currentCompanyFormProps(props.currentCompany)
      }


    });
    watch(() => (props.currentCompany), (newValues) => {
      if (newValues !== null) {
        formatCurrentCompanyPropNumber(newValues.phone_number)

        currentCompanyFormProps(newValues)

      } else {
        formState = Object.assign(formState, initialForm);

      }
    });
    const formatCurrentCompanyPropNumber = (numberString) => {
      const number = phoneUtil.parseAndKeepRawInput(numberString);
      let tempCode = '+' + number.getCountryCode()
      state.codesTelephone.forEach(country => {
        if (country.value === tempCode) {
          formState.code = country.value
        }
      })
      formState.phone_number = number.getNationalNumber();
      let phone = formState.code + number.getNationalNumber()
      state.phoneValid = !phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))
      if(phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))){
        state.phoneIsValid = true
      }else {
        state.phoneIsValid = false
      }
    }

    const currentCompanyFormProps = (company) => {
      let currentCompany = {
        company_email: company.company_email,
        name: company.name,
        location: company.location,
        employment_letter: [
          {
            "uid": company.id,
            "name": company.file_name,
            "url": company.employment_letter
          }
        ]

      };
      formState = Object.assign(formState, currentCompany);
    }
    const onFinish = (values) => {

      if (state.phoneValid === false) {
        const auth = {
          headers: {Authorization: 'Bearer ' + store.state.auth.token}

        };
        let fullPhone = formState.code + formState.phone_number

        let employmentObj = {
          company_email: values.company_email,
          name: values.name,
          location: values.location,
          phone_number: fullPhone,
          employment_letter: values.employment_letter[0].url,
          file_name: values.employment_letter[0].name
        };


        if (props.currentCompany) {
          state.saving = true;
          EmployersService.patchEmployer(store.state.auth.profile['profile_slug'], props.currentCompany.id, employmentObj, auth)
              .then(resp => {
                state.saving = false;
                ctx.emit('companyEdit', resp.data);
              })
              .catch(() => {
                state.saving = false;
              });


        } else {
          state.saving = true;
          EmployersService.createEmployer(store.state.auth.profile['profile_slug'], employmentObj, auth)
              .then(resp => {
                state.saving = false;
                ctx.emit('companyAdd', resp.data);
              })
              .catch(() => {
                state.saving = false;
              });
        }
      }



    };
    const onFinishFailed = (errorInfo) => {
      return errorInfo;
    };


    const cancelForm = () => {
      ctx.emit('cancelForm');
    };
    const uploadLetter = (e) => {
      const cloudName = import.meta.env.VITE_APP_CLOUD;
      const {file} = e;

      const unsignedUploadPreset = 'ml_default';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', unsignedUploadPreset);
      let CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
      // Send to cloudianry
      axios.post(
          CLOUDINARY_URL,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },

          }
      ).then(resp => {

        formState.employment_letter.forEach(fileObj => {
          if (fileObj.uid === file.uid) {
            fileObj.status = 'done';
            fileObj['url'] = resp.data.secure_url;
          }
        });


      });
    };
    let validatePhone = () => {
      let phone = formState.code + formState.phone_number
      if (formState.phone_number.length > 2) {
        state.phoneValid = !phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))
        if(phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone))){
          state.phoneIsValid = true
        }else {
          state.phoneIsValid = false
        }

      }
    };

    const disabled = computed(() => {
      return !(
          formState.company_email
          && formState.name
          && formState.location
          && formState.phone_number
          && formState.employment_letter




      );
    });

    const filterCountries = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };


    return {
      state,
      formState,
      disabled,
      formRef,
      onFinish,
      onFinishFailed,
      cancelForm,
      uploadLetter,
      validatePhone,
      filterCountries,


    };

  }

});
</script>

<style scoped>

</style>