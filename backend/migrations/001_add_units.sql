-- Migration: Add unit_type and unit columns to products table and unit column to order_items
-- This enables support for weight/volume measurements in addition to piece counting
-- Run this migration: npx wrangler d1 execute pos-db --local --file=backend/migrations/001_add_units.sql

-- Add unit_type column to products (piece, weight, volume)
ALTER TABLE products ADD COLUMN unit_type TEXT DEFAULT 'piece';

-- Add unit column to products (pcs, kg, g, l, ml)
ALTER TABLE products ADD COLUMN unit TEXT DEFAULT 'pcs';

-- Add unit column to order_items (to preserve unit info in order history)
ALTER TABLE order_items ADD COLUMN unit TEXT DEFAULT 'pcs';

-- Update all existing products to use piece/pcs (backward compatibility)
UPDATE products SET unit_type = 'piece', unit = 'pcs' WHERE unit_type IS NULL;

-- Update all existing order_items to use pcs (backward compatibility)
UPDATE order_items SET unit = 'pcs' WHERE unit IS NULL;

-- Note: SQLite is dynamically typed, so the existing INTEGER columns (stock, order_items.quantity)
-- will automatically accept REAL (decimal) values when inserted. No schema change needed.
-- The application layer will handle parsing values as floats where needed.
