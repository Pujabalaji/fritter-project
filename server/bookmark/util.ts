import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import { Bookmark, PopulatedBookmark } from './model';

// Update this if you add a property to the Bookmark type!
type BookmarkResponse = {
  _id: string;
  profileName: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  dateAdded: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Bookmark object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Bookmark>} bookmark - A user object
 * @returns {BookmarkResponse} - The bookmark object for front-end
 */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: PopulatedBookmark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {profileName} = bookmarkCopy.profileId;
  delete bookmarkCopy.profileId;
  const {content} = bookmarkCopy.freetId;
  const {username} = bookmarkCopy.freetId.authorId;
  const {dateCreated} = bookmarkCopy.freetId;
  const {dateModified} = bookmarkCopy.freetId;
  const {dateAdded} = bookmarkCopy;
  return {
    ...bookmarkCopy,
    _id: bookmarkCopy._id.toString(),
    profileName,
    author: username,
    dateCreated: formatDate(dateCreated),
    content,
    dateModified: formatDate(dateModified),
    dateAdded: formatDate(dateAdded)
  };
};

export {
  constructBookmarkResponse
};
