import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import Category from "src/module/category/domain/category.entity";

describe('CategoryModel Integration tests', () => {
    beforeEach(async () => {
        const sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            models: [CategoryModel],
            logging: false
        });

        await sequelize.sync({ force: true });
    });
    it("should create a new category", async () => {
        const category = Category.fake().aCategory().build();

        await CategoryModel.create({
            category_id: category.category_id.id,
            name: category.name,
            is_active: category.is_active,
            description: category.description,
            created_at: category.created_at
        });
    });

    test("mapping props", () => {
        const attributesMap = CategoryModel.getAttributes();
        const attributes = Object.keys(CategoryModel.getAttributes());

        expect(attributes).toStrictEqual([
            "category_id",
            "name",
            "description",
            "is_active",
            "created_at",
        ]);

        const categoryIdAttr = attributesMap.category_id;
        expect(categoryIdAttr).toMatchObject({
            field: "category_id",
            fieldName: "category_id",
            primaryKey: true,
            type: DataType.UUID(),
        });

        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            field: "name",
            fieldName: "name",
            allowNull: false,
            type: DataType.STRING(255),
        });

        const descriptionAttr = attributesMap.description;

        expect(descriptionAttr).toMatchObject({
            field: "description",
            fieldName: "description",
            allowNull: true,
            type: DataType.TEXT(),
        });

        const isActiveAttr = attributesMap.is_active;
        expect(isActiveAttr).toMatchObject({
            field: "is_active",
            fieldName: "is_active",
            allowNull: false,
            type: DataType.BOOLEAN(),
        });
    });
    test("create", async () => {
        //arrange
        const arrange = {
            category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
            name: "test",
            is_active: true,
            created_at: new Date(),
        };

        //act
        const category = await CategoryModel.create(arrange);

        //assert
        expect(category.toJSON()).toStrictEqual(arrange);
    });
});