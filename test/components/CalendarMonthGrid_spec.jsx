import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon-sandbox';

import CalendarMonth from '../../src/components/CalendarMonth';
import CalendarMonthGrid from '../../src/components/CalendarMonthGrid';

import getTransformStyles from '../../src/utils/getTransformStyles';

import getMonth from 'date-fns/getMonth';
import format from 'date-fns/format';

describe('CalendarMonthGrid', () => {
  it('the number of CalendarMonths rendered matches props.numberOfMonths + 2', () => {
    const NUM_OF_MONTHS = 5;
    const wrapper = shallow(<CalendarMonthGrid numberOfMonths={NUM_OF_MONTHS} />).dive();
    expect(wrapper.find(CalendarMonth)).to.have.lengthOf(NUM_OF_MONTHS + 2);
  });

  it('has style equal to getTransformStyles(foo)', () => {
    const translationValue = 100;
    const transformStyles = getTransformStyles(`translateX(${translationValue}px)`);
    const wrapper = shallow(<CalendarMonthGrid translationValue={translationValue} />).dive();
    Object.keys(transformStyles).forEach((key) => {
      expect(wrapper.prop('style')[key]).to.equal(transformStyles[key]);
    });
  });

  it('does not generate duplicate months', () => {
    const initialMonth = new Date();
    const wrapper = shallow((
      <CalendarMonthGrid numberOfMonths={12} initialMonth={initialMonth} />
    )).dive();

    wrapper.instance().componentWillReceiveProps({
      initialMonth,
      numberOfMonths: 24,
    });

    const { months } = wrapper.state();

    const collisions = months
      .map(m => format(m, 'yyyy-MM'))
      .reduce((acc, m) => ({ ...acc, [m]: true }), {});

    expect(Object.keys(collisions).length).to.equal(months.length);
  });

  it('works with the same number of months', () => {
    const initialMonth = new Date();
    const wrapper = shallow((
      <CalendarMonthGrid numberOfMonths={12} initialMonth={initialMonth} />
    )).dive();

    wrapper.instance().componentWillReceiveProps({
      initialMonth,
      numberOfMonths: 12,
      firstVisibleMonthIndex: 0,
    });

    const { months } = wrapper.state();

    const collisions = months
      .map(m => format(m, 'yyyy-MM'))
      .reduce((acc, m) => ({ ...acc, [m]: true }), {});

    expect(Object.keys(collisions).length).to.equal(months.length);
  });

  describe('#onMonthSelect', () => {
    it('calls onMonthChange', () => {
      const onMonthChangeSpy = sinon.spy();
      const wrapper = shallow(<CalendarMonthGrid onMonthChange={onMonthChangeSpy} />).dive();
      const currentMonth = new Date();
      const newMonthVal = (getMonth(currentMonth) + 5) % 12;
      wrapper.instance().onMonthSelect(currentMonth, newMonthVal);
      expect(onMonthChangeSpy.callCount).to.equal(1);
    });
  });

  describe('#onYearSelect', () => {
    it('calls onYearChange', () => {
      const onYearChangeSpy = sinon.spy();
      const wrapper = shallow(<CalendarMonthGrid onYearChange={onYearChangeSpy} />).dive();
      const currentMonth = new Date();
      const newMonthVal = (getMonth(currentMonth) + 5) % 12;
      wrapper.instance().onYearSelect(currentMonth, newMonthVal);
      expect(onYearChangeSpy.callCount).to.equal(1);
    });
  });
});
