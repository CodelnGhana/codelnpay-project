import Api from './Api'

export default {
    patchEmployee (profile_slug,emp_id,patch_data,auth){
        return Api().patch(`apiv1/update_employee/${profile_slug}/${emp_id}/`,patch_data,auth)
    },
    createEmployee (profile_slug,data,auth){
        return Api().post(`apiv1/create_employee/${profile_slug}/`,data,auth)
    },
    getMyEmployees (profile_slug,auth){
        return Api().get(`apiv1/all_employees/${profile_slug}/`,auth)
    },
    deletetEmployee (profile_slug,emp_id,auth){
        return Api().delete(`apiv1/update_employee/${profile_slug}/${emp_id}/`,auth)
    },

}
