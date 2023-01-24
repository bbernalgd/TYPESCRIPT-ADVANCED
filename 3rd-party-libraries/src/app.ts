import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { Product } from "./product.model";

const products = [
  { title: "A Carpet", price: 29.99 },
  { title: "A Book", price: 10.99 },
];

const newProd = new Product("", -5.99);
validate(newProd).then((errors) => {
  if (errors.length > 0) {
    console.log("VALIDATION ERRORS");
    console.log(errors);
  } else {
    console.log(newProd.getInformation());
  }
});

const loadedProducts = plainToInstance(Product, products);

for (const product of loadedProducts) {
  console.log(product.getInformation());
}
