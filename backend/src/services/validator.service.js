import Validator from 'validatorjs';

export default class ValidatorService {
    constructor(data, rules, customErrorMessages = null) {
        this.validation = new Validator(data, rules, customErrorMessages)
    }

    fails(callback) {
        if (this.validation.fails()) {
            callback(this.validation.errors.first(Object.keys(this.validation.errors.errors)[0]))
        }
    }
}