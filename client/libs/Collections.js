"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultDict extends Map {
    constructor(defaultFactory, entries) {
        super(entries);
        this.defaultFactory = defaultFactory;
    }
    get(name) {
        if (this.has(name)) {
            return super.get(name);
        }
        else {
            const value = this.defaultFactory();
            this.set(name, value);
            return value;
        }
    }
}
exports.DefaultDict = DefaultDict;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGVjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGlicy9Db2xsZWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0VBQStFO0FBQy9FLDBDQUEwQztBQUMxQyx1QkFBdUI7QUFDdkIsK0VBQStFOztBQUUvRSxNQUFhLFdBQWtCLFNBQVEsR0FBUztJQUc5QyxZQUFZLGNBQXVCLEVBQUUsT0FBc0M7UUFDekUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUE7SUFDdEMsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFPO1FBQ1QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUUsQ0FBQTtTQUN4QjthQUFNO1lBQ0wsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ3JCLE9BQU8sS0FBSyxDQUFBO1NBQ2I7SUFDSCxDQUFDO0NBQ0Y7QUFqQkQsa0NBaUJDIn0=