import Category from "./category.entity";
import { ISearchableRepository } from "../../@shared/domain/repository/repository-interface";
import { Uuid } from "src/module/@shared/domain/value-objects/uuid.vo";

export interface ICategoryRepository extends ISearchableRepository<Category, Uuid> {

}