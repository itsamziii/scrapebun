import json
import csv
import io


def json_to_csv(data):
    csv_buffer = io.StringIO()

    csv_writer = csv.writer(csv_buffer)

    if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
        headers = data[0].keys()
        csv_writer.writerow(headers)

        for item in data:
            csv_writer.writerow(item.values())
    else:
        csv_writer.writerow(["data"])
        csv_writer.writerow([json.dumps(data)])

    csv_content = csv_buffer.getvalue()
    csv_buffer.close()

    return csv_content
