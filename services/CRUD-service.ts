import { HttpError } from "routing-controllers";
import { Model, ModelStatic, Op } from "sequelize";

interface ICRUD {
    bulkCreate: (parentId: number, items: any[]) => Promise<Model[]>;
    readAll: (parentId: object) => Promise<Model[]>;
    updateItems: (items: any[]) => Promise<void[]>;
    deleteAll: (parentId: number, itemIds: number[]) => Promise<Model[]>;
}

export class CRUDService<T extends Model> implements ICRUD {
    public entityName: string;
    public parentName: String;
    public dbModel: ModelStatic<T>;
    public parentDbModel: ModelStatic<T>;

    constructor(entityName: string, dbModel: ModelStatic<T>, parentName: String, parentDbModel: ModelStatic<T>) {
        this.entityName = entityName;
        this.parentName = parentName;
        this.dbModel = dbModel;
        this.parentDbModel = parentDbModel;
    }


    private async isExistingParent(parentId: number): Promise<T> {
        try {
            return await this.parentDbModel.findByPk(parentId)
        } catch (e) {
            console.log("ERROR: ", e);
            throw e;
        }
    }

    public async bulkCreate(parentId: number, items: any[]): Promise<T[]> {
        try {
            if (!this.isExistingParent(parentId)) {
                throw new HttpError(404, `${this.parentName} not found`);
            }

            return await this.dbModel.bulkCreate(items);
        } catch (e) {
            console.log("ERROR: ", e);
            throw e;
        }
    }

    public async readAll(parentId: any): Promise<T[]> {
        try {
            const foreignKey: any = this.parentName.toLowerCase() + 'Id'
            const items = await this.dbModel.findAll({
                where: {
                    [foreignKey]: parentId
                }
            })
            const itemDataValues = items.map(scene => scene.get());
            return itemDataValues
        } catch (e) {
            console.log("ERROR: ", e);
            throw e;
        }
    }

    public async updateItems(items: any[]): Promise<void[]> {
        return await this.dbModel.sequelize.transaction(async (transaction) => {
            const updatePromises = items.map(async (item) => {
                const [updatedCount] = await this.dbModel.update(
                    item,
                    {
                        where: {
                            id: item.id
                        },
                        transaction
                    }
                );

                if (updatedCount === 0) {
                    throw new HttpError(404, `${this.entityName} with ID ${item.id} not found`)
                }
            })

            return await Promise.all(updatePromises);
        })
    }

    public async deleteAll(parentId: number, itemIds: any[]): Promise<T[]> {
        try {
            if (!this.isExistingParent(parentId)) {
                throw new HttpError(404, `${this.parentName} not found`);
            }

            const deletePromises = itemIds.map(async (itemId: any) => {
                const item = await this.dbModel.findByPk(itemId)
                if (!item) {
                    throw new HttpError(404, `${this.entityName} not found`)
                }
                return await this.dbModel.destroy({
                    where: { id: itemId }
                })
            })

            await Promise.all(deletePromises);
            const remainingItems = await this.readAll(parentId)
            return remainingItems;
        } catch (e) {
            console.log("ERROR: ", e);
            throw e;
        }
    }

}