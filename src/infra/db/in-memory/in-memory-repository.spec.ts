import { Entity } from "src/module/@shared/domain/entity";
import InMemoryRepository from "./in-memory-repository";
import { Uuid } from "src/module/@shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "src/module/@shared/domain/errors/not-found-error";

type StubEntityProps = {
    entity_id?: Uuid;
    name: string;
    price: number;
};

class StubEntity extends Entity {
    entity_id: Uuid;
    name: string;
    price: number;

    constructor(props: StubEntityProps) {
        super();
        this.entity_id = props.entity_id || new Uuid();
        this.name = props.name;
        this.price = props.price;
    }

    toJSON() {
        return {
            entity_id: this.entity_id.id,
            name: this.name,
            price: this.price
        };
    }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid>{
    getEntity(): new (...args: any[]) => StubEntity {
        return StubEntity;
    }
}

describe('InMemoryRepository Unit Tests', () => {
    let repo: StubInMemoryRepository;

    beforeEach(() => {
        repo = new StubInMemoryRepository();
    });

    test("should insert a new entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "test",
            price: 100
        });
        await repo.insert(entity);

        expect(repo.entityArray.length).toBe(1);
        expect(repo.entityArray[0]).toEqual(entity);
    });

    test("should bulk insert entities", async () => {
        const entity1 = new StubEntity({
            entity_id: new Uuid(),
            name: "test1",
            price: 100
        });

        const entity2 = new StubEntity({
            entity_id: new Uuid(),
            name: "test2",
            price: 200
        });

        const entity3 = new StubEntity({
            entity_id: new Uuid(),
            name: "test3",
            price: 300
        });

        const entity4 = new StubEntity({
            entity_id: new Uuid(),
            name: "test4",
            price: 400
        });

        const entities = [entity1, entity2, entity3, entity4];

        await repo.bulkInsert(entities);

        expect(repo.entityArray.length).toBe(4);
        expect(repo.entityArray[0]).toEqual(entity1);
        expect(repo.entityArray[1]).toEqual(entity2);
        expect(repo.entityArray[2]).toEqual(entity3);
        expect(repo.entityArray[3]).toEqual(entity4);
    });

    test("should update an entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "test1",
            price: 100
        });

        await repo.insert(entity);
        expect(repo.entityArray.length).toBe(1);
        expect(repo.entityArray[0]).toEqual(entity);

        const newName = "new name";
        const newPrice = 3200;
        entity.name = newName;
        entity.price = newPrice;

        await repo.update(entity);
        expect(repo.entityArray.length).toBe(1);
        expect(repo.entityArray[0].name).toBe(newName);
        expect(repo.entityArray[0].price).toBe(newPrice);
    });

    test("should delete an entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "test1",
            price: 100
        });

        await repo.insert(entity);
        expect(repo.entityArray.length).toBe(1);

        await repo.delete(entity.entity_id);
        expect(repo.entityArray.length).toBe(0);
    });

    test("should find an entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "test1",
            price: 100
        });

        await repo.insert(entity);
        expect(repo.entityArray.length).toBe(1);

        const foundEntity = await repo.findById(entity.entity_id);
        expect(foundEntity).toEqual(entity);
    });

    test("should find all entities", async () => {
        const entity1 = new StubEntity({
            entity_id: new Uuid(),
            name: "test1",
            price: 100
        });

        const entity2 = new StubEntity({
            entity_id: new Uuid(),
            name: "test2",
            price: 200
        });

        const entity3 = new StubEntity({
            entity_id: new Uuid(),
            name: "test3",
            price: 300
        });

        const entity4 = new StubEntity({
            entity_id: new Uuid(),
            name: "test4",
            price: 400
        });

        const entities = [entity1, entity2, entity3, entity4];

        await repo.bulkInsert(entities);
        expect(repo.entityArray.length).toBe(4);

        const foundedEntities = await repo.findAll();
        expect(foundedEntities.length).toBe(4);
        expect(foundedEntities).toEqual(entities);
    });

    it("should throw an error if not found when trying to delete an entity", async () => {
        const fakeId = new Uuid();
        expect(async () => {
            await repo.delete(fakeId);
        }).rejects.toThrow(new NotFoundError(fakeId, StubEntity));
    });

    it("should throws error on update when entity not found", async () => {
        const entity = new StubEntity({ name: "name value", price: 5 });
        await expect(repo.update(entity)).rejects.toThrow(
            new NotFoundError(entity.entity_id, StubEntity)
        );
    });
});