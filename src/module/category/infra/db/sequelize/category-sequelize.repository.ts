import { where } from "sequelize";
import { Entity } from "src/module/@shared/domain/entity";
import { ICategoryRepository } from "src/module/category/domain/category.repository";
import { CategoryModel } from "./category.model";
import Category from "src/module/category/domain/category.entity";
import { NotFoundError } from "src/module/@shared/domain/errors/not-found-error";
import { Uuid } from "src/module/@shared/domain/value-objects/uuid.vo";
import { SearchParams } from "src/module/@shared/domain/repository/search-params";
import { SearchResult } from "src/module/@shared/domain/repository/search-result";

export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ["name", "created_at"];

    constructor(private categoryModel: typeof CategoryModel) { }

    async insert(entity: Category): Promise<void> {
        await this.categoryModel.create({
            category_id: entity.category_id.id,
            name: entity.name,
            created_at: entity.created_at,
            description: entity.description
        });
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        await this.categoryModel.bulkCreate(entities.map((entity) => ({
            category_id: entity.category_id.id,
            name: entity.name,
            created_at: entity.created_at,
            description: entity.description
        })));
    }

    async update(entity: Category): Promise<void> {
        const id = entity.category_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }

        await this.categoryModel.update({
            name: entity.name,
            created_at: entity.created_at,
            description: entity.description
        }, { where: { category_id: id } });
    }

    async delete(entityId: Uuid): Promise<void> {
        const id = entityId.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }

        await this.categoryModel.destroy({ where: { category_id: id } });
    }

    async findById(entityId: Uuid): Promise<Category | null> {
        const model = await this._get(entityId.id);
        return new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            created_at: model.created_at,
            description: model.description
        });
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        const categories = models.map((category) => {
            return new Category({
                category_id: new Uuid(category.category_id),
                name: category.name,
                created_at: category.created_at,
                description: category.description
            });
        });
        return categories;
    }

    private async _get(id: string) {
        return await this.categoryModel.findByPk(id);
    }

    search(props: SearchParams<string>): Promise<SearchResult<Entity>> {
        throw new Error("Method not implemented.");
    }

    getEntity(): new (...args: any[]) => Category {
        throw new Error("Method not implemented.");
    }
}