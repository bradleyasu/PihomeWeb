import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../AxiosClient";

export type TaskPriority = "low" | "medium" | "high";

export type NewTaskData = {
    name: string;
    description: string;
    priority: number; // 1 = Low, 2 = Medium, 3 = High
    start_time?: string;
    state_id?: string;
    trigger_state?: string;
    repeat_days?: number;
    on_run?: any;
    on_confirm?: any;
    on_cancel?: any;
    background_image?: string;
};

const priorityMap = {
    "low": 1,
    "medium": 2,
    "high": 3
};

export const useCreateTask = () => {
    return useMutation((data: NewTaskData): any => {
        // Clean up event objects - remove null or empty event handlers
        const cleanedData = { ...data };
        
        if (!cleanedData.on_run || Object.keys(cleanedData.on_run).length === 0) {
            delete cleanedData.on_run;
        }
        
        if (!cleanedData.on_confirm || Object.keys(cleanedData.on_confirm).length === 0) {
            delete cleanedData.on_confirm;
        }
        
        if (!cleanedData.on_cancel || Object.keys(cleanedData.on_cancel).length === 0) {
            delete cleanedData.on_cancel;
        }
        
        const payload = {
            "webhook": {
                "type": "task",
                ...cleanedData
            }
        };
        return axiosClient.post('', payload);
    });
};

export const mapPriorityToNumber = (priority: TaskPriority): number => {
    return priorityMap[priority] || 1;
};

export const mapNumberToPriority = (priority: number): TaskPriority => {
    switch (priority) {
        case 3: return "high";
        case 2: return "medium";
        default: return "low";
    }
};
