I did this solution based on A5 (working). One issue was it did not display department id properly
```sh
Department.hasMany(Employee, {foreignKey: 'department'});
```
I had to comment out this line for this solution to function.
