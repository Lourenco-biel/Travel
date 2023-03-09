
import { toast } from 'react-toastify';

export const notify = (message) => toast.error(message);
export const successNotify = (message) => toast.success(message);