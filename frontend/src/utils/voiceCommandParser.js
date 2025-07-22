// A simple parser for voice commands
export const parseVoiceCommand = (command) => {
    command = command.toLowerCase().trim();

    // Example: "set pulse to 80 at 7"
    // Example: "set temp to 98.6 at 7"
    // Example: "set spo2 to 99 at 7"
    let match = command.match(/set (pulse|temp|spo2|cvp|rhythm|bp) to (.+?) at (\d{1,2})(?: (am|pm))?/);
    if (match) {
        let [, field, value, time, ampm] = match;
        let hour = parseInt(time, 10);
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        time = String(hour).padStart(2, '0');

        let updates = {};
        if (field === 'bp') {
            const bpValues = value.split(/[\s/]+/).map(Number);
            if(bpValues.length === 2 && !isNaN(bpValues[0]) && !isNaN(bpValues[1])) {
                 updates = { vitals: { bp_systolic: bpValues[0], bp_diastolic: bpValues[1] } };
            } else return null;
        } else {
            let parsedValue = (field !== 'rhythm') ? parseFloat(value) : value;
            if (field !== 'rhythm' && isNaN(parsedValue)) return null;
             updates = { vitals: { [field]: parsedValue } };
        }
        return { time: time + ':00', updates };
    }

    // Example: "set GCS eye to 4 at 10"
    match = command.match(/set gcs (eye|verbal|motor) to (\d) at (\d{1,2})(?: (am|pm))?/);
    if (match) {
        let [, field, value, time, ampm] = match;
        let hour = parseInt(time, 10);
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        time = String(hour).padStart(2, '0');
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return null;
        return { time: time + ':00', updates: { gcs: { [field]: numValue } } };
    }

    // Example: "record urine output 200 at 14"
    match = command.match(/(?:record|set) (urine|hourly iv|oral feed|drainage) (?:output )?(\d+) at (\d{1,2})(?: (am|pm))?/);
    if (match) {
        let [, field, value, time, ampm] = match;
        let hour = parseInt(time, 10);
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        time = String(hour).padStart(2, '0');
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return null;
        const fieldMap = { 'urine': 'urine', 'hourly iv': 'hourly_iv', 'oral feed': 'oral_feed', 'drainage': 'drainage' };
        const modelField = fieldMap[field.trim()];
        if (!modelField) return null;
        return { time: time + ':00', updates: { intake_output: { [modelField]: numValue } } };
    }

    // Example: "mark position change at 9"
    match = command.match(/mark (position change|mouth care|dressing change|eye care|bed sore care|bath|foley care) at (\d{1,2})(?: (am|pm))?/);
    if (match) {
        let [, careItem, time, ampm] = match;
        let hour = parseInt(time, 10);
        if (ampm === 'pm' && hour < 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        time = String(hour).padStart(2, '0');
        const fieldMap = { 'position change': 'position_change', 'mouth care': 'mouth_care', 'dressing change': 'dressing_change', 'eye care': 'eye_care', 'bed sore care': 'bed_sore_care', 'bath': 'bath', 'foley care': 'foley_care' };
        const modelField = fieldMap[careItem.trim()];
        if (!modelField) return null;
        return { time: time + ':00', updates: { nursing_care: { [modelField]: true } } };
    }
    
    return null;
};