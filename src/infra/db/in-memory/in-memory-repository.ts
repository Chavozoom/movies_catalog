import { Entity } from "src/module/@shared/domain/entity";
import { NotFoundError } from "src/module/@shared/domain/errors/not-found-error";
import { IRepository, ISearchableRepository } from "src/module/@shared/domain/repository/repository-interface";
import { SearchParams, SortDirection } from "src/module/@shared/domain/repository/search-params";
import { SearchResult } from "src/module/@shared/domain/repository/search-result";
import { ValueObject } from "src/module/@shared/domain/value-object";

export default abstract class InMemoryRepository<E extends Entity
    , EntityId extends ValueObject> implements IRepository<E, EntityId> {

    entityArray: E[] = [];
    async insert(entity: E): Promise<void> {
        this.entityArray.push(entity);
    }
    async bulkInsert(entity: E[]): Promise<void> {
        this.entityArray.push(...entity);
    }
    async update(entity: E): Promise<void> {
        const indexFound = this.entityArray.findIndex((entity) => entity.entity_id.equals(entity.entity_id));
        if (indexFound === -1) {
            throw new NotFoundError(entity.entity_id, this.getEntity());
        }
        this.entityArray[indexFound] = entity;
    }
    async delete(entityId: EntityId): Promise<void> {
        const indexFound = this.entityArray.findIndex((entity) => entity.entity_id.equals(entityId));
        if (indexFound === -1) {
            throw new NotFoundError(entityId, this.getEntity());
        }
        this.entityArray.splice(indexFound, 1);
    }
    async findById(entityId: EntityId): Promise<E | null> {
        const entity = this.entityArray.find((entity) => entity.entity_id.equals(entityId));
        return entity;
    }
    async findAll(): Promise<E[]> {
        return this.entityArray;
    }
    abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string
>
    extends InMemoryRepository<E, EntityId>
    implements ISearchableRepository<E, EntityId, Filter>
{
    sortableFields: string[] = [];
    async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
        const itemsFiltered = await this.applyFilter(this.entityArray, props.filter);
        const itemsSorted = this.applySort(
            itemsFiltered,
            props.sort,
            props.sort_dir
        );
        const itemsPaginated = this.applyPaginate(
            itemsSorted,
            props.page,
            props.per_page
        );
        return new SearchResult({
            items: itemsPaginated,
            total: itemsFiltered.length,
            current_page: props.page,
            per_page: props.per_page,
        });
    }

    protected abstract applyFilter(
        items: E[],
        filter: Filter | null
    ): Promise<E[]>;

    protected applyPaginate(
        items: E[],
        page: SearchParams["page"],
        per_page: SearchParams["per_page"]
    ) {
        const start = (page - 1) * per_page; // 0 * 15 = 0
        const limit = start + per_page; // 0 + 15 = 15
        return items.slice(start, limit);
    }

    protected applySort(
        items: E[],
        sort: string | null,
        sort_dir: SortDirection | null,

        custom_getter?: (sort: string, item: E) => any
    ) {
        if (!sort || !this.sortableFields.includes(sort)) {
            return items;
        }

        return [...items].sort((a, b) => {
            //@ts-ignore
            const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
            //@ts-ignore
            const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
            if (aValue < bValue) {
                return sort_dir === "asc" ? -1 : 1;
            }

            if (aValue > bValue) {
                return sort_dir === "asc" ? 1 : -1;
            }

            return 0;
        });
    }
}