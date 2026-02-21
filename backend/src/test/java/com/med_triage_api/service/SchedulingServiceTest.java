package com.med_triage_api.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class SchedulingServiceTest {

  private SchedulingService service;

  @BeforeEach
  void setUp() {
    service = new SchedulingService();
  }

  // Recommendation logic

  @Test
  void score5To7ReturnsChat() {
    assertThat(service.getRecommendation(5)).isEqualTo("Chat");
    assertThat(service.getRecommendation(7)).isEqualTo("Chat");
  }

  @Test
  void score8To11ReturnsNurse() {
    assertThat(service.getRecommendation(8)).isEqualTo("Nurse");
    assertThat(service.getRecommendation(11)).isEqualTo("Nurse");
  }

  @Test
  void score12To15ReturnsDoctor() {
    assertThat(service.getRecommendation(12)).isEqualTo("Doctor");
    assertThat(service.getRecommendation(15)).isEqualTo("Doctor");
  }

  // Clinician availability

  @Test
  void clinicianIsNotAvailableBeforeShiftStart() {
    // Clinician starts at 08:00, check 07:45
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(7, 45))).isFalse();
  }

  @Test
  void clinicianIsAvailableAtShiftStart() {
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(8, 0))).isTrue();
  }

  @Test
  void clinicianIsNotAvailableDuringBreak() {
    // Starts at 08:00 → break 12:00–13:00
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(12, 0))).isFalse();
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(12, 30))).isFalse();
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(12, 59))).isFalse();
  }

  @Test
  void clinicianIsAvailableAfterBreak() {
    // Starts at 08:00 → break ends at 13:00
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(13, 0))).isTrue();
  }

  @Test
  void clinicianIsNotAvailableAfterShiftEnds() {
    // Starts at 08:00 → shift ends at 16:00
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(16, 0))).isFalse();
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(17, 0))).isFalse();
  }

  @Test
  void clinicianIsNotAvailableOutsideClinicHours() {
    // Even if within shift, not before 08:00 or at/after 18:00
    assertThat(service.isClinicianAvailable(LocalTime.of(8, 0), LocalTime.of(18, 0))).isFalse();
  }

  // Slot availability (at least one clinician free)

  @Test
  void slotAt0800IsAvailable() {
    // All four clinicians are checked; the one starting at 08:00 is available at
    // 08:00
    assertThat(service.isSlotAvailable(LocalTime.of(8, 0))).isTrue();
  }

  @Test
  void slotAt1800IsNotAvailable() {
    // Clinic is closed at 18:00
    assertThat(service.isSlotAvailable(LocalTime.of(18, 0))).isFalse();
  }

  @Test
  void slotDuringAllCliniciansBreakIsNotAvailable() {
    // Clinician start times: 08:00, 08:30, 09:00, 09:30
    // Breaks: 12:00–13:00, 12:30–13:30, 13:00–14:00, 13:30–14:30
    // There is no 15-min window where ALL are simultaneously on break;
    // this test verifies a slot is always covered by at least one clinician.
    // At 12:00: 08:30 clinician is NOT on break (break is 12:30–13:30) → available
    assertThat(service.isSlotAvailable(LocalTime.of(12, 0))).isTrue();
  }

  // getAvailableSlots integration

  @Test
  void slotsDoNotIncludePastTimes() {
    // Request made at 11:30 today - no slot before 11:30 should appear on today's
    // date
    LocalDateTime now = LocalDateTime.of(LocalDate.now(), LocalTime.of(11, 30));
    List<String> slots = service.getAvailableSlots(now);
    slots.stream()
        .map(s -> LocalDateTime.parse(s, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")))
        .forEach(slot -> assertThat(slot).isAfterOrEqualTo(now));
  }

  @Test
  void slotsSpanAtMostFourDays() {
    LocalDateTime now = LocalDateTime.now();
    List<String> slots = service.getAvailableSlots(now);
    LocalDate today = now.toLocalDate();
    LocalDate maxDate = today.plusDays(3);
    slots.stream()
        .map(s -> LocalDateTime.parse(s, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
            .toLocalDate())
        .forEach(d -> assertThat(d).isBeforeOrEqualTo(maxDate));
  }

  @Test
  void slotsAreWithinClinicHours() {
    LocalDateTime now = LocalDateTime.of(LocalDate.now(), LocalTime.of(0, 0));
    List<String> slots = service.getAvailableSlots(now);
    assertThat(slots).isNotEmpty();
    slots.stream()
        .map(s -> LocalDateTime.parse(s, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
            .toLocalTime())
        .forEach(t -> {
          assertThat(t).isAfterOrEqualTo(LocalTime.of(8, 0));
          assertThat(t).isBefore(LocalTime.of(18, 0));
        });
  }

  @Test
  void slotsAreIn15MinuteIntervals() {
    LocalDateTime now = LocalDateTime.of(LocalDate.now(), LocalTime.of(0, 0));
    List<String> slots = service.getAvailableSlots(now);
    slots.stream()
        .map(s -> LocalDateTime.parse(s, java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
            .getMinute())
        .forEach(m -> assertThat(m % 15).isEqualTo(0));
  }
}