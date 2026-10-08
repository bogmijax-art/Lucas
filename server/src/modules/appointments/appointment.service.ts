import {
  createAppointment,
  deleteAppointment,
  findAppointmentById,
  findAppointmentsByCompany,
  updateAppointment,
} from "./appointment.repository.js";

interface CreateAppointmentInput {
  customerId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
}

interface UpdateAppointmentInput {
  customerId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
}

const appointmentStatuses = [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
] as const;

const validateTimes = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid appointment time");
  }

  if (end <= start) {
    throw new Error("End time must be after start time");
  }
};

export const getAppointments = async (companyId: string) => {
  return findAppointmentsByCompany(companyId);
};

export const getAppointment = async (
  appointmentId: string,
  companyId: string
) => {
  const appointment = await findAppointmentById(
    appointmentId,
    companyId
  );

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};

export const addAppointment = async (
  companyId: string,
  userId: string,
  input: CreateAppointmentInput
) => {
  const title = input.title?.trim();

  if (!title) {
    throw new Error("Appointment title is required");
  }

  if (!input.startTime || !input.endTime) {
    throw new Error("Start time and end time are required");
  }

  validateTimes(input.startTime, input.endTime);

  if (
    input.status &&
    !appointmentStatuses.includes(
      input.status as (typeof appointmentStatuses)[number]
    )
  ) {
    throw new Error("Invalid appointment status");
  }

  const appointment = await createAppointment({
    companyId,
    customerId: input.customerId?.trim(),
    createdBy: userId,
    title,
    description: input.description?.trim(),
    startTime: input.startTime,
    endTime: input.endTime,
    status: input.status,
  });

  if (!appointment) {
    throw new Error(
      "Customer not found or does not belong to this company"
    );
  }

  return appointment;
};

export const editAppointment = async (
  appointmentId: string,
  companyId: string,
  input: UpdateAppointmentInput
) => {
  const title = input.title?.trim();

  if (!title) {
    throw new Error("Appointment title is required");
  }

  if (!input.startTime || !input.endTime) {
    throw new Error("Start time and end time are required");
  }

  validateTimes(input.startTime, input.endTime);

  if (
    input.status &&
    !appointmentStatuses.includes(
      input.status as (typeof appointmentStatuses)[number]
    )
  ) {
    throw new Error("Invalid appointment status");
  }

  const appointment = await updateAppointment(
    appointmentId,
    companyId,
    {
      customerId: input.customerId?.trim(),
      title,
      description: input.description?.trim(),
      startTime: input.startTime,
      endTime: input.endTime,
      status: input.status,
    }
  );

  if (!appointment) {
    throw new Error(
      "Appointment not found or customer does not belong to this company"
    );
  }

  return appointment;
};

export const removeAppointment = async (
  appointmentId: string,
  companyId: string
) => {
  const appointment = await deleteAppointment(
    appointmentId,
    companyId
  );

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};