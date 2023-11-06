import CategoryValidator from "./category.validator";
import EntityValidationError from "./validators/validation.error";
import { CategoryFakeBuilder } from "./category-fake.builder";
import { Uuid } from "src/module/@shared/domain/value-objects/uuid.vo";
import { Entity } from "src/module/@shared/domain/entity";
import { ValueObject } from "src/module/@shared/domain/value-object";

export type CategoryProps = {
    category_id?: Uuid;
    name: string;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date;
};

export type CategoryCreateCommand = {
    name: string;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date;
};

export default class Category extends Entity {

    category_id: Uuid;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at?: Date;

    constructor(props: CategoryProps) {
        super();
        this.category_id = props.category_id ?? new Uuid();
        this.name = props.name;
        this.description = props.description ?? null;
        this.is_active = props.is_active ?? true;
        this.created_at = props.created_at ?? new Date();
    }

    static create(props: CategoryCreateCommand): Category {
        const category = new Category(props);
        Category.validate(category);
        return category;
    }

    static validate(entity: Category) {
        const validator = CategoryValidatorFactory.create();
        const isValid = validator.validate(entity);
        if (!isValid) {
            throw new EntityValidationError(validator.errors);
        }
    }

    static fake() {
        return CategoryFakeBuilder;
    }

    get entity_id(): ValueObject {
        return this.entity_id;
    }

    changeName(name: string): void {
        this.name = name;
        Category.validate(this);
    }

    changeDescription(description: string): void {
        this.description = description;
        Category.validate(this);
    }

    update(name: string, description: string): void {
        name && this.changeName(name);
        description && this.changeDescription(description);
        Category.validate(this);
    }

    activate(): void {
        this.is_active = true;
    }

    deactivate(): void {
        this.is_active = false;
    }

    toJSON() {
        return {
            category_id: this.category_id.id,
            name: this.name,
            description: this.description,
            is_active: this.is_active,
            created_at: this.created_at,
        };
    }
}

export class CategoryValidatorFactory {
    static create() {
        return new CategoryValidator();
    }
}