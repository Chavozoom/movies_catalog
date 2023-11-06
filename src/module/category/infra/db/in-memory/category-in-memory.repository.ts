import { SortDirection } from "src/module/@shared/domain/repository/search-params";
import { Uuid } from "src/module/@shared/domain/value-objects/uuid.vo";
import Category from "src/module/category/domain/category.entity";

export class CategoryInMemoryRepository
    extends InMemorySearchableRepository<Category, Uuid> {
    sortableFields: string[] = ["name", "created_at"];

    protected async applyFilter(items: Category[], filter: string): Promise<Category[]> {
        if (!filter) {
            return items;
        }

        return items.filter((i) => {
            return (
                i.name.toLowerCase().includes(filter.toLowerCase())
            );
        });
    };
    getEntity(): new (...args: any[]) => Category {
        return Category;
    }
    protected applySort(items: Category[], sort: string | null,
        sort_dir: SortDirection | null,
    ) {
        return sort ? super.applySort(items, sort, sort_dir) : super.applySort(items, "created_at", "desc");
    }
} 