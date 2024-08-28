import csv
from flask import jsonify

# Assuming this function reads your apps_in_scope CSV file
def read_apps_in_scope(csv_file_path):
    apps_in_scope = []
    with open(csv_file_path, mode='r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            apps_in_scope.append(row['main_application'])  # Assuming 'main_application' is the column name in your CSV
    return apps_in_scope

def update_applications_data(data, apps_in_scope):
    # Creating a set of all apps present in the database data
    present_apps = set(d['main_application'] for d in data)
    
    new_data = []
    
    # Updating existing data as per your logic
    for i in range(len(data)):
        new_dict = {}
        new_dict['count_of_all_hosts'] = int(data[i]['count_of_all_hosts'])
        new_dict['count_of_anomaly_hosts'] = int(data[i]['count_of_anomaly_hosts'])
        new_dict['max_score'] = int(data[i]['max_score'])

        if int(data[i]['max_score']) >= 80:
            new_dict['severity'] = 'high'
        elif int(data[i]['max_score']) >= 50 and int(data[i]['max_score']) < 80:
            new_dict['severity'] = 'medium'
        elif int(data[i]['max_score']) < 50:
            new_dict['severity'] = 'low'
        else:
            new_dict['severity'] = 'low'

        new_dict['anomaly_hosts'] = data[i]['anomaly_hosts']
        new_dict['main_application'] = data[i]['main_application']
        new_dict['number_of_anomalies'] = data[i]['number_of_anomalies']
        new_dict['percentage_hosts_affected'] = float(data[i]['percentage_hosts_affected'])
        new_dict['team'] = data[i]['team']
        new_dict['host_details'] = data[i]['AnomalyHostsDetails']
        new_dict['host_expanded_details'] = data[i]['TransformedAnomalyHostsDetails']
        
        new_data.append(new_dict)
    
    # Add default entries for apps that are not present in the database result
    for app in apps_in_scope:
        if app not in present_apps:
            new_data.append({
                'main_application': app,
                'count_of_all_hosts': 0,  # Default value
                'count_of_anomaly_hosts': 0,  # Default value
                'max_score': 0,  # Default value
                'severity': 'low',  # Default value
                'anomaly_hosts': 'N/A',  # Default value
                'number_of_anomalies': 0,  # Default value
                'percentage_hosts_affected': 0.0,  # Default value
                'team': 'N/A',  # Default value
                'host_details': 'N/A',  # Default value
                'host_expanded_details': 'N/A',  # Default value
            })

    return new_data

def applications_collated_data_query(connection_pool):
    connection = connection_pool.getconn()
    connection.autocommit = True
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            collated_data_query = generate_application_collated_data_query()
            if collated_data_query == '':
                raise Exception('Parameters passed are invalid')
            cursor.execute(collated_data_query)
            data = cursor.fetchall()
            apps_in_scope = read_apps_in_scope('/path/to/your/csvfile.csv')  # Replace with your actual path
            updated_data = update_applications_data(data, apps_in_scope)
            return jsonify(updated_data)
    except Exception as e:
        print(f"Error fetching all data: {str(e)}")
        return jsonify({'error': 'Error fetching all data'}), 500
    finally:
        connection_pool.putconn(connection)
