import { Uuid } from "src/module/@shared/domain/value-objects/uuid.vo";
import Category, { CategoryCreateCommand } from "../category.entity";

describe('Category entity test', () => {
    let validateSpy = jest.spyOn(Category, "validate");
    describe('constructor', () => {
        it("should create a category with default values", () => {
            const categoryName = "Movie";
            const category = new Category({
                name: categoryName
            });
            expect(category.name).toEqual(categoryName);
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.description).toBeNull();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(category.is_active).toBeTruthy();
        });
        it("should create a category with all values", () => {
            const categoryName = "Movie";
            const category_id = new Uuid();
            const description = "Movie description";
            const created_at = new Date();
            const is_active = false;

            const category = new Category({
                name: categoryName,
                category_id,
                description,
                created_at,
                is_active
            });

            expect(category.name).toEqual(categoryName);
            expect(category.category_id).toBe(category_id);
            expect(category.description).toBe(description);
            expect(category.created_at).toBe(created_at);
            expect(category.is_active).toBe(is_active);
        });
        it("should create a new category using factory", () => {
            const categoryProps: CategoryCreateCommand = {
                name: "Category",
                description: "Category description",
                created_at: new Date(),
                is_active: false
            };

            const category = Category.create(categoryProps);

            expect(category.name).toBe("Category");
            expect(category.description).toBe("Category description");
            expect(category.created_at).toBeInstanceOf(Date);
            expect(category.is_active).toBeFalsy();
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('category_id', () => {
        const arrange = [
            { category_id: null },
            { category_id: undefined },
            { category_id: new Uuid() }
        ];

        test.each(arrange)("id = %j", ({ category_id }) => {
            const category = new Category({
                name: "movie",
                category_id
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
        });
    });

    describe('update', () => {
        it("should update both name and category", () => {
            const categoryProps: CategoryCreateCommand = {
                name: "Category",
                description: "Category description",
                created_at: new Date(),
                is_active: false
            };
            const category = Category.create(categoryProps);

            const newName = "new category name";
            const newCategoryDesc = "new category description";
            category.update(newName, newCategoryDesc);
            expect(category.name).toBe(newName);
            expect(category.description).toBe(newCategoryDesc);
        });

        it("should update only name", () => {
            const categoryDesc = "category description";

            const categoryProps: CategoryCreateCommand = {
                name: "Category",
                description: categoryDesc,
                created_at: new Date(),
                is_active: false
            };
            const category = Category.create(categoryProps);

            const newName = "new category name";
            category.update(newName, null);
            expect(category.name).toBe(newName);
            expect(category.description).toBe(categoryDesc);
        });

        it("should update only description", () => {
            const name = "category name";

            const categoryProps: CategoryCreateCommand = {
                name,
                description: "category description",
                created_at: new Date(),
                is_active: false
            };

            const category = Category.create(categoryProps);

            const newDescription = "new category description";
            category.update(null, newDescription);
            expect(category.description).toBe(newDescription);
            expect(category.name).toBe(name);
        });
    });

    describe('changes', () => {
        const categoryProps: CategoryCreateCommand = {
            name: "Category",
            description: "Category description",
            created_at: new Date(),
            is_active: false
        };
        const category = Category.create(categoryProps);
        expect(validateSpy).toHaveBeenCalledTimes(1);

        it("should change name", () => {
            const newName = "new category name";
            category.changeName(newName);
            expect(category.name).toBe(newName);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        it("should change description", () => {
            const newDescription = "new category description";
            category.changeDescription(newDescription);
            expect(category.description).toBe(newDescription);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        it("should activate", () => {
            expect(category.is_active).toBeFalsy();
            category.activate();
            expect(category.is_active).toBeTruthy();
        });

        it("should deactivate", () => {
            const categoryProps: CategoryCreateCommand = {
                name: "Category",
                description: "Category description",
                created_at: new Date(),
            };
            const category = Category.create(categoryProps);

            expect(category.is_active).toBeTruthy;
            category.deactivate();
            expect(category.is_active).toBeFalsy();
        });
    });

    describe('Category validator', () => {
        let validateSpy = jest.spyOn(Category, "validate");
        describe('create command', () => {
            it("should throw an error when invalid name is null", () => {
                expect(() => {
                    Category.create({
                        name: null
                    });
                }).toThrowError("Validation Error");
                expect(validateSpy).toHaveBeenCalledTimes(1);
            });
            it("should throw an error when invalid name is empty", () => {
                expect(() => {
                    Category.create({
                        name: ""
                    });
                }).toThrowError("Validation Error");
                expect(validateSpy).toHaveBeenCalledTimes(1);
            });
        });
        test("should an invalid category with name property", () => {
            const arrange = [];

            expect(() => Category.create({ name: null })).containsErrorMessages({
                name: [
                    "name should not be empty",
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters",
                ],
            });

            expect(() => Category.create({ name: "" })).containsErrorMessages({
                name: ["name should not be empty"],
            });

            expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
                name: [
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters",
                ],
            });

            expect(() =>
                Category.create({ name: "t".repeat(256) })
            ).containsErrorMessages({
                name: ["name must be shorter than or equal to 255 characters"],
            });
        });

        it("should a invalid category using description property", () => {
            expect(() =>
                Category.create({ description: 5 } as any)
            ).containsErrorMessages({
                description: ["description must be a string"],
            });
        });

        it("should a invalid category using is_active property", () => {
            expect(() =>
                Category.create({ is_active: 5 } as any)
            ).containsErrorMessages({
                is_active: ["is_active must be a boolean value"],
            });
        });
        describe("changeName method", () => {
            it("should a invalid category using name property", () => {
                const category = Category.create({ name: "Movie" });
                expect(() => category.changeName(null)).containsErrorMessages({
                    name: [
                        "name should not be empty",
                        "name must be a string",
                        "name must be shorter than or equal to 255 characters",
                    ],
                });

                expect(() => category.changeName("")).containsErrorMessages({
                    name: ["name should not be empty"],
                });

                expect(() => category.changeName(5 as any)).containsErrorMessages({
                    name: [
                        "name must be a string",
                        "name must be shorter than or equal to 255 characters",
                    ],
                });

                expect(() => category.changeName("t".repeat(256))).containsErrorMessages({
                    name: ["name must be shorter than or equal to 255 characters"],
                });
            });
            describe("changeDescription method", () => {
                it("should a invalid category using description property", () => {
                    const category = Category.create({ name: "Movie" });
                    expect(() => category.changeDescription(5 as any)).containsErrorMessages({
                        description: ["description must be a string"],
                    });
                });
            });
        });
    });
});