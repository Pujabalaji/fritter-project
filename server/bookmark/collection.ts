import type {HydratedDocument, Types} from 'mongoose';
import { Bookmark } from './model';
import BookmarkModel from './model';
import ProfileCollection from '../profile/collection';
import FreetCollection from '../freet/collection';
import FreetModel from '../freet/model';


class BookmarkCollection {
    /**
   * Add a bookmark to the collection
   *
   * @param {string} freetId - The id of the freet to bookmark
   * @param {string} profileId - The id of the profile to save the bookmark to
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(freetId: Types.ObjectId | string, profileId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const date = new Date();
    const bookmark = new BookmarkModel({
      freetId,
      profileId,
      dateAdded: date
    });
    await bookmark.save(); // Saves freet to MongoDB
    return await bookmark.populate(['freetId', 'profileId']);
  }

  /**
   * Find a bookmark by bookmarkId
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
   static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({_id: bookmarkId}).populate(['freetId', 'profileId']);
  }

    /**
   * Get all the bookmarks in the database
   *
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the freets
   */
     static async findAll(): Promise<Array<HydratedDocument<Bookmark>>> {
        // Retrieves bookmarks and sorts them from most to least recent
        const bookmarks = await BookmarkModel.find({}).sort({dateAdded: -1}).populate([{path: 'freetId', populate: {path: 'authorId'}}, 'profileId']);
        return bookmarks
      }

    /**
     * Find a bookmark under given profile name.
     * @param profileName 
     * @param freetId 
     * @returns a bookmark with matching freetId AND profileName
     */
    static async findOneByFreetIdAndProfileName(profileName: string, freetId: string): Promise<HydratedDocument<Bookmark>> {
      const profileIdFromProfileName = (await ProfileCollection.findOneByProfileName(profileName))._id;
      return BookmarkModel.findOne({profileId: profileIdFromProfileName, freetId: freetId}).populate([{path: 'freetId', populate: {path: 'authorId'}}, 'profileId']);
    }

  /**
   * Get all the bookmarks by given profile
   *
   * @param {string} profileName - The profileName of the profile that saved the tweet
   * @param {string} userId - the id of the user that has profileName
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
   static async findAllByProfileNameAndUserId(profileName: string, userId: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const profile = await ProfileCollection.findOneByProfileNameAndUserId(profileName, userId);
    return BookmarkModel.find({profileId: profile._id}).populate([{path: 'freetId', populate: {path: 'authorId'}}, 'profileId']);;
  }

  /**
   * Get all the bookmarks by given profile with keyword
   *
   * @param {string} profileName - The profileName of the profile that saved the tweet
   * @param {string} userId - the id of the user that has profileName
   * @param {string} keyword - the string to search for
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAllByProfileNameAndUserIdAndKeyword(profileName: string, userId: string, keyword: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const profile = await ProfileCollection.findOneByProfileNameAndUserId(profileName, userId);
    const escapeStringRegexp = require('escape-string-regexp');
    const $regex = escapeStringRegexp(keyword);
    const matchingFreetIds = await FreetModel.find({content: { $regex }})
    return BookmarkModel.find({profileId: profile._id, freetId: {$in: matchingFreetIds}}).populate([{path: 'freetId', populate: {path: 'authorId'}}, 'profileId']);;
  }

  /**
   * Return all bookmarked freets by user with keyword (in any profile).
   * 
   * @param userId current user
   * @param keyword keyword to query for
   * @returns 
   */  
  static async findAllByKeyword(userId: string, keyword: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const escapeStringRegexp = require('escape-string-regexp');
    const $regex = escapeStringRegexp(keyword);
    const matchingFreetIds = await FreetModel.find({content: { $regex }})
    return BookmarkModel.find({freetId: {$in: matchingFreetIds}}).populate([{path: 'freetId', populate: {path: 'authorId'}}, 'profileId']);
  }

  /**
   * Delete a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The id of the bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
   static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const freet = await BookmarkModel.deleteOne({_id: bookmarkId});
    return freet !== null;
  }

  /**
   * Delete all the bookmarks by the profile and user
   *
   * @param {string} profileId - The id of profile bookmarks are saved to
   */
   static async deleteManyByProfileId(profileId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({profileId});
  }

  /**
   * Delete all the bookmarks containing given freetId
   * 
   * @param {string} freetId - The id of the freet bookmarked
   */
   static async deleteManyByFreetId(freetId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({freetId});
  }
}

export default BookmarkCollection;