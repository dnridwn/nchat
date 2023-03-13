export default {
    rules: {
        firstname: 'required',
        lastname: 'required',
        username: 'required',
        email: 'required',
        password: 'required|confirmed'
    },
    error_messages: {
        required: 'Please fill :attribute'
    }
}