const ical = require('ical-generator');
const express = require('express');
const cheerio = require('cheerio');
const { fetchData, handleError } = require('./utils');
const { LINKKI_EVENTS_URL, ALGO_EVENTS_URL } = require('./config');

const router = express.Router();

router.get('/linkki', async (req, res) => {
  try {
    const currentDate = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    const baseUrl = `${LINKKI_EVENTS_URL}/c_g2eqt2a7u1fc1pahe2o0ecm7as@group.calendar.google.com/events`;
    const params = {
      calendarId: 'c_g2eqt2a7u1fc1pahe2o0ecm7as@group.calendar.google.com',
      singleEvents: 'true',
      timeZone: 'Europe/Helsinki',
      timeMin: currentDate.toISOString(),
      timeMax: twoMonthsFromNow.toISOString(),
      orderBy: 'startTime',
      key: 'AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'
    };
    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;
    const data = await fetchData(url);
    res.send(data);
  } catch (err) {
    handleError(err, res);
  }
});

router.get('/algo', async (req, res) => {
  try {
    const html = await fetchData(ALGO_EVENTS_URL);
    const $ = cheerio.load(html);
    const events = [];
    $('article.eventlist-event.eventlist-event--upcoming').each((i, el) => {
      const summary = $(el).find('a.eventlist-title-link').text();
      const date = $(el).find('time.event-date').attr('datetime');
      events.push({ summary, start: { date: date } });
    });
    res.json({items: events});
  } catch (err) {
    handleError(err, res);
  }
});

router.get('/algo/ical', async (req, res) => {
  try {
    const calendar = new ical.ICalCalendar()
    calendar.name('Algon Tapahtumat')
    calendar.prodId('-')
    

    const html = await fetchData(ALGO_EVENTS_URL);
    const $ = cheerio.load(html);
    $('article.eventlist-event.eventlist-event--upcoming').each((i, el) => {
      const summary = $(el).find('a.eventlist-title-link').text();
      const date = $(el).find('time.event-date').attr('datetime');
      const startTime = $(el).find('time.event-time-localized-start').text()
      const endTime = $(el).find('time.event-time-localized-end').text()
      const start = new Date(Date.parse(`${date}T${startTime.replace('.',':')}`))
      const end = new Date(Date.parse(`${date}T${endTime.replace('.',':')}`))

      calendar.createEvent({
        summary,
        start,
        end
      });
    });

    res.type('text/calendar').send(calendar.toString())
  } catch (err) {
    handleError(err, res);
  }
})

module.exports = router;
