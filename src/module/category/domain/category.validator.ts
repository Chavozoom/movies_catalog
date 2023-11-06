import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, validateSync } from "class-validator";
import Category from "./category.entity";
import { ClassValidatorFields } from "./validators/class-validator-fields";

class CategoryRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;

    constructor({ name, description, is_active }: Category) {
        Object.assign(this, { name, description, is_active });
    };
}

export default class CategoryValidator extends ClassValidatorFields<CategoryRules> {
    validate(entity: Category) {
        return super.validate(new CategoryRules(entity));
    }
}