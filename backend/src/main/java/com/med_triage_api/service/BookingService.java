package com.med_triage_api.service;

import com.med_triage_api.model.BookingResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory booking store. No database required.
 * Data is lost on restart - acceptable per the assignment spec.
 */
@Service
public class BookingService {

  private final Map<String, BookingResponse> bookings = new ConcurrentHashMap<>();

  public BookingResponse createBooking(String slot, String recommendation) {
    String confirmationId = UUID.randomUUID().toString().substring(0, 8);
    BookingResponse response = new BookingResponse(confirmationId, slot, recommendation);
    bookings.put(confirmationId, response);
    return response;
  }

  public BookingResponse getBooking(String confirmationId) {
    return bookings.get(confirmationId);
  }
}