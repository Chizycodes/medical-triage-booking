package com.med_triage_api.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Scheduling assumptions:
 * - 4 clinicians available, with hard-coded start times: 08:00, 08:30, 09:00,
 * 09:30.
 * This ensures coverage is spread throughout the operating window.
 * - Each clinician works 8 hours, taking a 1-hour break exactly 4 hours after
 * their start.
 * - Clinic operating window: 08:00–18:00 local time.
 * - Slots are 15-minute intervals within the operating window.
 * - A slot is available if at least one clinician is available (not on break,
 * not past 8h shift).
 * - Slots are generated for today + 3 calendar days, excluding past slots.
 */
@Service
public class SchedulingService {

  static final LocalTime CLINIC_OPEN = LocalTime.of(8, 0);
  static final LocalTime CLINIC_CLOSE = LocalTime.of(18, 0);
  static final int SLOT_MINUTES = 15;
  static final int SHIFT_HOURS = 8;
  static final int BREAK_START_HOURS = 4; // break starts 4h after shift start
  static final int BREAK_DURATION_HOURS = 1;

  /**
   * Hard-coded clinician start times within the operating window.
   * Each clinician starts at a different offset to maximise coverage.
   */
  static final List<LocalTime> CLINICIAN_START_TIMES = List.of(
      LocalTime.of(8, 0),
      LocalTime.of(8, 30),
      LocalTime.of(9, 0),
      LocalTime.of(9, 30));

  private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

  /**
   * Returns all available 15-minute slots within the next 3 calendar days
   * (today inclusive) that are not in the past.
   */
  public List<String> getAvailableSlots(LocalDateTime now) {
    List<String> slots = new ArrayList<>();
    LocalDate today = now.toLocalDate();

    for (int dayOffset = 0; dayOffset <= 3; dayOffset++) {
      LocalDate date = today.plusDays(dayOffset);
      LocalTime cursor = CLINIC_OPEN;

      while (cursor.isBefore(CLINIC_CLOSE)) {
        LocalDateTime slotDateTime = LocalDateTime.of(date, cursor);

        // Skip past slots
        if (!slotDateTime.isBefore(now) && isSlotAvailable(cursor)) {
          slots.add(slotDateTime.format(ISO_FORMATTER));
        }

        cursor = cursor.plusMinutes(SLOT_MINUTES);
      }
    }

    return slots;
  }

  /**
   * A slot is available if at least one clinician is working and not on break at
   * that time.
   *
   * @param slotTime the wall-clock time of the slot
   */
  boolean isSlotAvailable(LocalTime slotTime) {
    for (LocalTime startTime : CLINICIAN_START_TIMES) {
      if (isClinicianAvailable(startTime, slotTime)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether a clinician starting at {@code startTime} is available at
   * {@code slotTime}.
   * Available means:
   * 1. The slot is within the clinician's 8-hour shift.
   * 2. The slot is not within the clinician's 1-hour break (starting 4h into the
   * shift).
   * 3. The slot is within the clinic operating window (08:00–18:00).
   */
  boolean isClinicianAvailable(LocalTime startTime, LocalTime slotTime) {
    LocalTime shiftEnd = startTime.plusHours(SHIFT_HOURS);
    LocalTime breakStart = startTime.plusHours(BREAK_START_HOURS);
    LocalTime breakEnd = breakStart.plusHours(BREAK_DURATION_HOURS);

    // Must be within operating hours
    if (slotTime.isBefore(CLINIC_OPEN) || !slotTime.isBefore(CLINIC_CLOSE)) {
      return false;
    }

    // Must be within clinician's shift
    if (slotTime.isBefore(startTime) || !slotTime.isBefore(shiftEnd)) {
      return false;
    }

    // Must not be during the break
    boolean duringBreak = !slotTime.isBefore(breakStart) && slotTime.isBefore(breakEnd);
    return !duringBreak;
  }

  /**
   * Derives a recommendation from a triage score.
   * Score 5–7 → Chat
   * Score 8–11 → Nurse
   * Score 12–15 → Doctor
   */
  public String getRecommendation(int score) {
    if (score <= 7)
      return "Chat";
    if (score <= 11)
      return "Nurse";
    return "Doctor";
  }
}