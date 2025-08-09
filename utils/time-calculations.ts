/**
 * Time calculation utilities for production planning
 */

export function calculateBlockDuration(shotCount: number): string {
    const minutesPerShot = 15;
    // Removed setup time - block duration should equal sum of unit times
    const totalMinutes = (shotCount * minutesPerShot);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function parseTimeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
}

export function formatMinutesToDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function addTimeToTime(baseTime: string, addTime: string, breakTime: string = "0:00"): string {
    const parseTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const formatTime = (totalMinutes: number) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    };

    const baseMinutes = parseTime(baseTime);
    const addMinutes = parseTime(addTime);
    const breakMinutes = parseTime(breakTime);
    
    return formatTime(baseMinutes + addMinutes + breakMinutes);
}