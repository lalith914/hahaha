import csv
import os
from supabase import create_client

# Initialize Supabase client
SUPABASE_URL = "https://nyfndnamjyfurtkkclmv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Zm5kbmFtanlmdXJ0a2tjbG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDA5ODAsImV4cCI6MjA4MDU3Njk4MH0.8eT-XatC1ul3G9Gp4ykWi0vBtX0EUJYpwU_DAtBcum4"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_foods_from_csv(csv_file):
    """Insert food data from CSV into Supabase"""
    
    try:
        print("Reading CSV file and preparing data...")
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            foods_data = []
            
            for idx, row in enumerate(csv_reader):
                # Clean up the data - only include columns that exist in Supabase
                food_item = {
                    'name': row['name'],
                    'category': row['category'].lower(),
                    'type': row['type'].lower(),
                    'calories': int(float(row['calories'])),
                    'protein': float(row['protein']),
                    'carbs': float(row['carbs']),
                    'fat': float(row['fat']),
                    'fiber': float(row['fiber']),
                    'price': int(float(row['price'])),
                    'image': row['image'],
                    'swiggyUrl': row.get('swiggyUrl', '') or '',
                    'zomatoUrl': row.get('zomatoUrl', '') or '',
                    'description': row.get('description', '') or '',
                    'benefits': row.get('benefits', '') or '',
                }
                foods_data.append(food_item)
            
            print(f"Total foods to insert: {len(foods_data)}")
            
            # Insert data in batches of 50 (smaller batches for reliability)
            batch_size = 50
            success_count = 0
            for i in range(0, len(foods_data), batch_size):
                batch = foods_data[i:i + batch_size]
                batch_num = i // batch_size + 1
                total_batches = (len(foods_data) + batch_size - 1) // batch_size
                print(f"Inserting batch {batch_num}/{total_batches}...")
                
                try:
                    response = supabase.table('foods').insert(batch).execute()
                    print(f"✅ Successfully inserted {len(batch)} foods (Batch {batch_num})")
                    success_count += len(batch)
                except Exception as e:
                    print(f"❌ Error in batch {batch_num}: {str(e)}")
        
        print(f"\n✅ Total foods inserted: {success_count} / {len(foods_data)}")
        
    except FileNotFoundError:
        print(f"Error: CSV file '{csv_file}' not found")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    csv_file = "healthy_foods_500.csv"
    insert_foods_from_csv(csv_file)


