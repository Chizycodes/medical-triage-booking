package com.med_triage_api.controller;

import com.med_triage_api.model.AssessmentRequest;
import com.med_triage_api.model.AssessmentResponse;
import com.med_triage_api.model.BookingRequest;
import com.med_triage_api.model.BookingResponse;
import com.med_triage_api.service.BookingService;
import com.med_triage_api.service.SchedulingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class MedTriageController {

  private final SchedulingService schedulingService;
  private final BookingService bookingService;

  public MedTriageController(SchedulingService schedulingService, BookingService bookingService) {
    this.schedulingService = schedulingService;
    this.bookingService = bookingService;
  }

  /**
   * POST /assessment
   * Accepts a triage score, returns a recommendation and available booking slots.
   */
  @PostMapping("/assessment")
  public ResponseEntity<AssessmentResponse> assess(@Valid @RequestBody AssessmentRequest request) {
    String recommendation = schedulingService.getRecommendation(request.getScore());
    List<String> slots = schedulingService.getAvailableSlots(LocalDateTime.now());
    return ResponseEntity.ok(new AssessmentResponse(recommendation, slots));
  }

  /**
   * POST /booking
   * Confirms a booking for a given slot and recommendation.
   */
  @PostMapping("/booking")
  public ResponseEntity<BookingResponse> book(@Valid @RequestBody BookingRequest request) {
    BookingResponse response = bookingService.createBooking(
        request.getSlot(),
        request.getRecommendation());
    return ResponseEntity.ok(response);
  }
}