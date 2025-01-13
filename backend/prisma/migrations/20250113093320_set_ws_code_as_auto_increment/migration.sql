-- AlterTable
CREATE SEQUENCE product_ws_code_seq;
ALTER TABLE "Product" ALTER COLUMN "ws_code" SET DEFAULT nextval('product_ws_code_seq');
ALTER SEQUENCE product_ws_code_seq OWNED BY "Product"."ws_code";
