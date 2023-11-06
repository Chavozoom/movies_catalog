import { FieldsErrors } from "./class-validator-fields-interface";

export default class EntityValidationError extends Error {
    constructor(public errors: FieldsErrors, message = "Validation Error") {
        super(message);
    }

    count() {
        return Object.keys(this.errors).length;
    }
}