import logging

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass, config):
    _LOGGER.info("Multi-list shopping integration is loading!")
    return True


    # test 123